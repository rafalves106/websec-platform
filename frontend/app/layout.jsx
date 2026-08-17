import './globals.css';

export const metadata = {
  title: 'WebSec — Trilha de Segurança',
  description: 'Sua sessão diária de estudo em segurança web e mobile',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-carbon-950 font-display">{children}</body>
    </html>
  );
}
