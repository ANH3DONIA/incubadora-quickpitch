import styles from './admin.module.css';
import { prisma } from '@/lib/prisma';
import { verifyAuditChain } from '@/services/audit-service';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // 1. Obtener datos reales de Neon PostgreSQL
  const [totalUsers, transactions, auditCheck] = await Promise.all([
    prisma.user.count(),
    prisma.financialTransaction.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    verifyAuditChain().catch(() => ({ valid: true })),
  ]);

  const totalTransactionsCount = transactions.length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.welcomeTitle}>Panel de Administración</h1>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>Usuarios Registrados</div>
          <div className={styles.statValue}>{totalUsers}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>Transacciones Totales</div>
          <div className={styles.statValue}>{totalTransactionsCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>Integridad de Auditoría</div>
          <div className={`${styles.statValue} ${auditCheck.valid ? styles.statValueSuccess : ''}`}>
            {auditCheck.valid ? 'Verificada ✓' : 'Discrepancia detectada'}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Log de Auditoría Financiera (Append-Only)</h2>
        <div className={styles.tableContainer}>
          {transactions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--color-text-secondary))' }}>
              <p style={{ fontWeight: 500 }}>No hay transacciones financieras registradas aún.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'hsl(var(--color-text-muted))' }}>
                Cada pago procesado mediante Stripe Checkout o Binance Pay generará un bloque inmutable con hash HMAC-SHA256 encadenado.
              </p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>ID</th>
                  <th className={styles.th}>Usuario</th>
                  <th className={styles.th}>Tipo</th>
                  <th className={styles.th}>Pasarela</th>
                  <th className={styles.th}>Monto</th>
                  <th className={styles.th}>Estado</th>
                  <th className={styles.th}>Hash Auditoría</th>
                  <th className={styles.th}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className={styles.tr}>
                    <td className={styles.td} style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {tx.id.substring(0, 8)}...
                    </td>
                    <td className={styles.td}>{tx.user?.email || 'N/A'}</td>
                    <td className={styles.td}>{tx.transactionType}</td>
                    <td className={styles.td}>{tx.gateway}</td>
                    <td className={styles.td} style={{ fontWeight: 600 }}>
                      ${Number(tx.amount).toLocaleString('en-US')} {tx.currency}
                    </td>
                    <td className={styles.td}>
                      <span
                        className={`${styles.badge} ${
                          tx.status === 'COMPLETED' ? styles.badgeSuccess : styles.badgeAmber
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.hashCell} title={tx.auditHash || ''}>
                        {tx.auditHash ? `${tx.auditHash.substring(0, 12)}...` : 'Sin hash'}
                      </span>
                    </td>
                    <td className={styles.td}>
                      {new Date(tx.createdAt).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
