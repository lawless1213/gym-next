export default function Head() {
  return (
    <>
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" href="/favicon-light.svg" media="(prefers-color-scheme: light)" />
      <link rel="icon" href="/favicon-dark.svg" media="(prefers-color-scheme: dark)" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
    </>
  );
}