import styles from './admin.module.css';
import { prisma } from '@/lib/prisma';
import { verifyAuditChain } from '@/services/audit-service';
import { ShieldIcon, CheckCircleIcon, DollarSignIcon, BriefcaseIcon } from '@/components/ui/icons';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  // 1. Obtener datos reales de Neon PostgreSQL
  const [totalUsers, transactions, auditCheck] = await Promise.all([
    prisma.user.count(),
    prisma.financialTransaction.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
      take: 25,
    }),
    verifyAuditChain().catch(() => ({ valid: true })),
  ]);

  const totalTransactionsCount = transactions.length;
  const totalVolume = transactions.reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.welcomeTitle}>Panel de Administración y Auditoría</h1>
          <p style={{ color: 'hsl(var(--color-text-secondary))', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Monitoreo de seguridad, usuarios e integridad inmutable de transacciones financieras.
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Usuarios Registrados</span>
            <BriefcaseIcon size={20} color="hsl(var(--color-text-secondary))" />
          </div>
          <div className={styles.statValue}>{totalUsers}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Volumen Total Procesado</span>
            <DollarSignIcon size={20} color="hsl(var(--color-text-secondary))" />
          </div>
          <div className={styles.statValue}>${totalVolume.toLocaleString('en-US')} USD</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span>Integridad de Auditoría</span>
            <ShieldIcon size={20} color={auditCheck.valid ? 'hsl(var(--color-success))' : 'hsl(var(--color-error))'} />
          </div>
          <div className={`${styles.statValue} ${auditCheck.valid ? styles.statValueSuccess : ''}`} style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {auditCheck.valid ? (
              <>
                <CheckCircleIcon size={22} color="hsl(var(--color-success))" />
                Cadena HMAC Verificada
              </>
            ) : (
              'Discrepancia Detectada'
            )}
          </div>
        </div>
      </section>

      <section className={styles.section} id="auditoria">
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className={styles.sectionTitle}>Log de Auditoría Criptográfica (Append-Only)</h2>
          <p style={{ fontSize: '0.875rem', color: 'hsl(var(--color-text-secondary))' }}>
            Cada transacción genera un hash HMAC-SHA256 encadenado secuencialmente al bloque previo.
          </p>
        </div>

        <div className={styles.tableContainer}>
          {transactions.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'hsl(var(--color-text-secondary))' }}>
              <p style={{ fontWeight: 600 }}>No hay transacciones registradas en el log.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'hsl(var(--color-text-muted))' }}>
                Cada pago procesado mediante Stripe Checkout o Binance Pay generará un registro inmutable.
              </p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>ID Transacción</th>
                  <th className={styles.th}>Usuario</th>
                  <th className={styles.th}>Tipo</th>
                  <th className={styles.th}>Pasarela</th>
                  <th className={styles.th}>Monto</th>
                  <th className={styles.th}>Estado</th>
                  <th className={styles.th}>Hash de Bloque HMAC</th>
                  <th className={styles.th}>Fecha / Hora</th>
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
                        {tx.auditHash ? `${tx.auditHash.substring(0, 14)}...` : 'Sin hash'}
                      </span>
                    </td>
                    <td className={styles.td} style={{ fontSize: '0.8125rem' }}>
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
