function OrdersList({ orders, loading, error, userRole, onUpdateOrder, onShowChat }) {
    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>Error fetching orders: {error}</p>;
    if (!orders || orders.length === 0) return <p>No orders found.</p>;

    const renderActionButtons = (order) => {
        // Vendor sees 'Accept' button for pending orders
        if (userRole === 'vendor' && order.status === 'pending') {
            return <button onClick={() => onUpdateOrder(order._id, 'accepted')}>Accept Order</button>;
        }
        // Assigned vendor or driver sees 'Complete' button for accepted orders
        if (order.status === 'accepted') {
            return (
                <>
                    <button onClick={() => onUpdateOrder(order._id, 'completed')}>Complete Order</button>
                    <button onClick={() => onShowChat(order)} style={{ marginLeft: '1rem' }}>Show Chat</button>
                </>
            );
        }
        return null;
    };

    return (
        <div>
            <h4>Orders</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {orders.map(order => (
                    <li key={order._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                        <p><strong>Part:</strong> {order.part.name} (Quantity: {order.quantity})</p>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Driver:</strong> {order.driver.name}</p>
                        {order.vendor && <p><strong>Vendor:</strong> {order.vendor.name}</p>}
                        {renderActionButtons(order)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OrdersList;