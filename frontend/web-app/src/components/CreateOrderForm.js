import { useState } from 'react';

function CreateOrderForm({ onSubmit, error }) {
    const [partId, setPartId] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!partId) {
            alert('Please enter a Part ID.');
            return;
        }
        onSubmit({ partId, quantity });
        setPartId('');
        setQuantity(1);
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <h4>Create New Order</h4>
            <input
                type="text"
                placeholder="Part ID"
                value={partId}
                onChange={(e) => setPartId(e.target.value)}
                required
            />
            <input
                type="number"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                required
            />
            <button type="submit">Create Order</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default CreateOrderForm;