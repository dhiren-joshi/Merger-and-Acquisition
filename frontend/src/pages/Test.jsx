// Simple test component
export default function Test() {
    return (
        <div style={{ padding: '20px', fontSize: '24px' }}>
            <h1>Test Page - If you see this, React is working!</h1>
            <p>Current time: {new Date().toLocaleTimeString()}</p>
        </div>
    );
}
