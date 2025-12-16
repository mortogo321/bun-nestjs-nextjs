import { UserList } from '@/components/UserList';
import { HealthStatus } from '@/components/HealthStatus';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>Bun + NestJS + Next.js</h1>
        <p>POC Ecosystem with Modern Stack</p>
      </header>

      <section className={styles.section}>
        <h2>API Health Status</h2>
        <HealthStatus />
      </section>

      <section className={styles.section}>
        <h2>Users from API</h2>
        <UserList />
      </section>
    </main>
  );
}
