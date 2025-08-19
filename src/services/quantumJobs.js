export const BACKEND = { SIMULATOR: 'simulator', QPU: 'qpu' };

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

export function generateJobId() {
  const date = new Date();
  const stamp = date.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
  const rand = Math.random().toString(36).slice(2, 8);
  return `q-${stamp}-${rand}`;
}

export function estimateDurationsMs({ backend, shots }) {
  const normalizedShots = Math.max(1, Number.isFinite(shots) ? Math.floor(shots) : 2000);
  if (backend === BACKEND.SIMULATOR) {
    const scale = clamp(Math.sqrt(normalizedShots / 1000), 0.4, 4);
    const queueMs = randomInRange(20, 80);
    const runMs = randomInRange(200, 600) * scale;
    const totalMs = Math.round(queueMs + runMs);
    return { queueMs: Math.round(queueMs), runMs: Math.round(runMs), totalMs };
  }
  // QPU
  const baseQueue = randomInRange(8000, 25000);
  const runBase = randomInRange(900, 2500);
  const runPerShot = 0.2; // ms per shot
  const runMs = runBase + normalizedShots * runPerShot;
  const jitOverhead = randomInRange(200, 800);
  const queueMs = baseQueue + jitOverhead;
  const totalMs = Math.round(queueMs + runMs);
  return { queueMs: Math.round(queueMs), runMs: Math.round(runMs), totalMs };
}

function makeMockResult({ backend, shots }) {
  // Produce a plausible result payload
  const assignmentBits = 6;
  const assignment = Array.from({ length: assignmentBits }, () => Math.random() < 0.5 ? 0 : 1);
  const cutValue = assignment.reduce((acc, bit, idx) => acc + (bit === (idx % 2) ? 1 : 0), 0);
  const counts = {};
  for (let i = 0; i < Math.min(64, Math.max(10, Math.floor(shots / 50))); i += 1) {
    const bitstring = assignment.map(b => b).join('');
    counts[bitstring] = (counts[bitstring] || 0) + Math.max(1, Math.floor(Math.random() * 10));
  }
  const backendLabel = backend === BACKEND.SIMULATOR ? 'Simulator' : 'QPU';
  return {
    solution: { cut_value: cutValue, assignment },
    counts,
    backend: backendLabel
  };
}

/**
 * Start a mock quantum job and stream updates via onUpdate callback.
 * Returns a cancel function.
 */
export function startMockQuantumJob(options, onUpdate) {
  const backend = options.backend || BACKEND.SIMULATOR;
  const shots = Number.isFinite(options.shots) ? options.shots : 2000;
  const jobId = generateJobId();
  const { queueMs, runMs, totalMs } = estimateDurationsMs({ backend, shots });
  let elapsedMs = 0;
  let status = 'queued';
  let progress = 0;

  const tickIntervalMs = 250;
  const startedAt = Date.now();

  const maybeEmit = () => {
    const etaMs = Math.max(0, totalMs - elapsedMs);
    onUpdate({
      jobId,
      status,
      backend,
      shots,
      progress,
      etaMs,
      metrics: {
        queueMs,
        runMs,
        totalMs,
        elapsedMs
      }
    });
  };

  maybeEmit();

  const intervalId = setInterval(() => {
    elapsedMs = Date.now() - startedAt;

    if (elapsedMs < queueMs) {
      status = 'queued';
      progress = clamp(elapsedMs / totalMs, 0, 0.25);
    } else if (elapsedMs < totalMs) {
      status = 'running';
      const runningElapsed = elapsedMs - queueMs;
      const runningProgress = runningElapsed / runMs;
      progress = clamp(0.25 + runningProgress * 0.75, 0.25, 0.999);
    } else {
      // final state: success or failure
      clearInterval(intervalId);
      if (Math.random() < 0.06) {
        status = 'failed';
        progress = 1;
        onUpdate({
          jobId,
          status,
          backend,
          shots,
          progress,
          etaMs: 0,
          metrics: { queueMs, runMs, totalMs, elapsedMs: totalMs },
          error: { code: 'QPU_TASK_ERROR', message: 'Provider reported an execution error' }
        });
        return;
      }
      status = 'completed';
      progress = 1;
      onUpdate({
        jobId,
        status,
        backend,
        shots,
        progress,
        etaMs: 0,
        metrics: { queueMs, runMs, totalMs, elapsedMs: totalMs },
        result: makeMockResult({ backend, shots })
      });
      return;
    }

    maybeEmit();
  }, tickIntervalMs);

  return () => {
    clearInterval(intervalId);
    status = 'cancelled';
    onUpdate({
      jobId,
      status,
      backend,
      shots,
      progress,
      etaMs: 0,
      metrics: { queueMs, runMs, totalMs, elapsedMs }
    });
  };
}

