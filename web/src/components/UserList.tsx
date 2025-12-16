'use client';

import { useEffect, useState } from 'react';
import { fetchUsers, createUser, deleteUser, type User } from '@/lib/api';
import styles from './UserList.module.css';

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to load users. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;

    setSubmitting(true);
    try {
      await createUser(newUser);
      setNewUser({ name: '', email: '' });
      await loadUsers();
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      setError('Failed to delete user');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading users...</div>;
  }

  return (
    <div className={styles.container}>
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className={styles.input}
          required
        />
        <button type="submit" disabled={submitting} className={styles.button}>
          {submitting ? 'Adding...' : 'Add User'}
        </button>
      </form>

      <div className={styles.list}>
        {users.length === 0 ? (
          <p className={styles.empty}>No users found</p>
        ) : (
          users.map((user) => (
            <div key={user.id} className={styles.card}>
              <div className={styles.info}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
              <button onClick={() => handleDelete(user.id)} className={styles.deleteBtn}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
