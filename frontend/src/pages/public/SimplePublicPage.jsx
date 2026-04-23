export default function SimplePublicPage({ title, text }) {
  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '60px 20px',
        background: '#fff',
        color: '#111',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: '40px', marginBottom: '15px' }}>
        {title}
      </h1>

      <p style={{ fontSize: '18px', maxWidth: '700px', margin: '0 auto' }}>
        {text}
      </p>
    </section>
  );
}