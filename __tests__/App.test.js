import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

describe('App', () => {
  it('renders welcome text', () => {
    render(<App />);
    expect(screen.getByText('Добро пожаловать!')).toBeTruthy();
  });
});

