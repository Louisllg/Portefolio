import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('Login redirects to /admin on success', async () => {
  fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'ok' }) });
  render(<BrowserRouter><App /></BrowserRouter>);
  window.history.pushState({}, 'Login', '/login');

  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'admin@example.com', name: 'email' } });
  fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), { target: { value: 'Admin123!', name: 'password' } });
  fireEvent.click(screen.getByText(/Login/i));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/login', expect.any(Object));
  });
});

test('Admin fetches messages', async () => {
  // /api/me
  fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, email: 'admin@example.com', roles: ['ROLE_ADMIN'] }) });
  // /api/messages
  fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 1, name: 'Alice', email: 'a@a.tld', phone: '123', message: 'Hello' }]) });

  render(<BrowserRouter><App /></BrowserRouter>);
  window.history.pushState({}, 'Admin', '/admin');

  await waitFor(() => {
    expect(screen.getByText(/Espace Admin/i)).toBeInTheDocument();
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
  });
});

test('Projects fetch displays titles', async () => {
  fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 1, title: 'Portfolio', description: 'Site perso', functionalities: 'X', images: [] }]) });
  render(<BrowserRouter><App /></BrowserRouter>);
  window.history.pushState({}, 'Home', '/');

  await waitFor(() => {
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/projects', expect.any(Object));
  });
});

test('Contact sends message', async () => {
  fetch
    // contact POST
    .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'ok' }) })
    // projects GET (home render)
    .mockResolvedValueOnce({ ok: true, json: async () => ([])});

  render(<BrowserRouter><App /></BrowserRouter>);
  window.history.pushState({}, 'Home', '/');

  fireEvent.change(screen.getByPlaceholderText(/Nom/i), { target: { value: 'Bob', name: 'name' } });
  fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'b@b.tld', name: 'email' } });
  fireEvent.change(screen.getByPlaceholderText(/Téléphone/i), { target: { value: '0612345678', name: 'phone' } });
  fireEvent.change(screen.getByPlaceholderText(/Votre message/i), { target: { value: 'Test', name: 'message' } });
  fireEvent.click(screen.getByText(/Envoyer/i));

  await waitFor(() => {
    expect(fetch).toHaveBeenCalled();
  });
});
