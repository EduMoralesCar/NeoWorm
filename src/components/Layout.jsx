export default function Layout({ children }) {
  return <div style={styles.wrapper}>{children}</div>;
}

const styles = {
  wrapper: {
    width: '100%', height: '100%', display: 'flex',
    flexDirection: 'column', overflow: 'hidden', position: 'relative',
  },
};
