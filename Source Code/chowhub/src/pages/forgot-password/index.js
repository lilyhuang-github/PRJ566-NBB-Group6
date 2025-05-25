// pages/reset-password/index.js

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Header } from '@/components/Header';
import Top from '@/components/Top';
import styles from '../create-restaurant/createRes.module.css';
import { Form, Button, Container, Alert } from 'react-bootstrap';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('idle');
    setError('');

    try {
       // API call to request password reset
      await apiFetch('/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong.');
    }
  }

  return (
    <>
      <Top />
      <Header title="🔐 Reset Your Password" image="/images/create-res-header.jpg" />
      <Container className="mt-5">
        <Form
          onSubmit={handleSubmit}
          className={`bg-dark text-light p-4 rounded shadow ${styles.formWrapper}`}
        >
          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.inputLarge}
              placeholder="Enter your registered email"
            />
          </Form.Group>

          {/* Display success/error messages based on status */}
          {status === 'success' && (
            <Alert variant="success" className="mt-3">
              ✅ If this email exists, a reset link has been sent.
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="danger" className="mt-3">
              ❌ {error}
            </Alert>
          )}

          <Button type="submit" variant="success" className={`mt-2 ${styles.registerBtn}`}>
            Send Reset Link
          </Button>
        </Form>
      </Container>
    </>
  );
}
