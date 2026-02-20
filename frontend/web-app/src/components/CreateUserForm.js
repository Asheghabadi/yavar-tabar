import { useState } from 'react';

function CreateUserForm({ onSubmit, error }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('driver'); // Default role

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !phone) {
            alert('Please fill in all fields.');
            return;
        }
        onSubmit({ name, phone, role });
        setName('');
        setPhone('');
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <h3>Create New User</h3>
            <div style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginRight: '1rem' }}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ marginRight: '1rem' }}
                />
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginRight: '1rem' }}>
                    <option value="driver">Driver</option>
                    <option value="vendor">Vendor</option>
                </select>
                <button type="submit">Create User</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default CreateUserForm;
