import { createServiceClient } from '../../lib/supabase';

export default async function handler(req: any, res: any) {
  const supabase = createServiceClient();
  if (!supabase) { res.status(500).json({ error: 'Supabase not configured' }); return; }

  if (req.method === 'POST') {
    try {
      const { name, phone, email, source, tour_id, date_from, date_to, pax_count, comment, operator_id, created_by } = req.body || {};
      if (!name || (!phone && !email)) { res.status(400).json({ error: 'name and phone or email required' }); return; }

      const normPhone = typeof phone === 'string' ? phone.replace(/\D+/g, '') : null;
      const normEmail = typeof email === 'string' ? email.trim().toLowerCase() : null;

      // Upsert/find contact by phone/email
      let contactId: string | null = null;
      if (normPhone || normEmail) {
        const { data: existingContacts } = await supabase
          .from('crm_contacts')
          .select('id, phone, email')
          .or((normPhone ? `lower(phone)=.${normPhone}.` : '') + (normPhone && normEmail ? ',' : '') + (normEmail ? `lower(email).eq.${normEmail}` : ''));

        if (existingContacts && existingContacts.length > 0) {
          contactId = existingContacts[0].id;
        } else {
          const { data: newContact, error: cErr } = await supabase
            .from('crm_contacts')
            .insert({ name, phone: normPhone, email: normEmail, created_by: created_by ?? null })
            .select('id')
            .single();
          if (cErr) throw cErr;
          contactId = newContact.id;
        }
      }

      // Deduplicate lead: recent open for same contact+tour
      let dedupLeadId: string | null = null;
      if (contactId) {
        const { data: openLeads } = await supabase
          .from('crm_leads')
          .select('id, status, created_at')
          .eq('contact_id', contactId)
          .eq('tour_id', tour_id)
          .in('status', ['new','qualified','offer']);
        if (openLeads && openLeads.length > 0) {
          dedupLeadId = openLeads[0].id;
        }
      }

      if (dedupLeadId) {
        res.status(200).json({ id: dedupLeadId, deduped: true });
        return;
      }

      const payload = {
        contact_id: contactId,
        operator_id: operator_id ?? null,
        source: source ?? null,
        tour_id: tour_id ?? null,
        date_from: date_from ?? null,
        date_to: date_to ?? null,
        pax_count: pax_count ?? null,
        comment: comment ?? null,
        status: 'new',
        created_by: created_by ?? null,
      } as any;

      const { data: lead, error: lErr } = await supabase
        .from('crm_leads')
        .insert(payload)
        .select('id')
        .single();
      if (lErr) throw lErr;
      res.status(201).json({ id: lead.id, deduped: false });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Lead create failed' });
    }
    return;
  }

  if (req.method === 'GET') {
    try {
      const { status, operator_id, limit = 50 } = req.query || {};
      let q = supabase
        .from('crm_leads')
        .select('id, status, created_at, tour_id, pax_count, date_from, date_to, contact:crm_contacts!crm_leads_contact_id_fkey(id,name,phone,email)')
        .order('created_at', { ascending: false })
        .limit(Number(limit));
      if (status) q = q.eq('status', status as string);
      if (operator_id) q = q.eq('operator_id', operator_id as string);
      const { data, error } = await q;
      if (error) throw error;
      res.status(200).json({ leads: data });
    } catch (e: any) {
      res.status(500).json({ error: e?.message || 'Lead list failed' });
    }
    return;
  }

  res.status(405).json({ error: 'Method Not Allowed' });
}

