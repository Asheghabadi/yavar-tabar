import { useState, useEffect } from 'react';
import { getOrders, createOrder, updateOrder } from '../services/api';
import CreateOrderForm from '../components/CreateOrderForm';
import OrdersList from '../components/OrdersList';
import Chat from '../components/Chat';
import jwt_decode from 'jwt-decode';

function DashboardPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [createOrderError, setCreateOrderError] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                // Assuming the token payload contains user's name, id, and role
                setUser({ 
                    id: decodedToken.userId, 
                    role: decodedToken.role, 
                    name: decodedToken.name || 'User' // Fallback name
                });
            } catch (e) {
                console.error("Invalid token", e);
            }
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await getOrders();
                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleCreateOrder = async (orderData) => {
        try {
            setCreateOrderError(null);
            const newOrder = await createOrder(orderData);
            setOrders([newOrder, ...orders]);
        } catch (err) {
            setCreateOrderError(err.message);
        }
    };

    const handleUpdateOrder = async (orderId, status) => {
        try {
            const updatedOrder = await updateOrder(orderId, status);
            setOrders(orders.map(order => 
                order._id === updatedOrder._id ? updatedOrder : order
            ));
        } catch (err) {
            console.error("Failed to update order:", err);
            // Optionally, set an error state to show in the UI
        }
    };

    return (
        <div>
            <h2>Dashboard</h2>
            
            {user && user.role === 'driver' && 
                <CreateOrderForm onSubmit={handleCreateOrder} error={createOrderError} />
            }

            {selectedOrder ? (
                <Chat orderId={selectedOrder._id} currentUser={user} />
            ) : (
                <OrdersList 
                    orders={orders} 
                    loading={loading} 
                    error={error} 
                    userRole={user ? user.role : null}
                    onUpdateOrder={handleUpdateOrder}
                    onShowChat={setSelectedOrder}
                />
            )}
        </div>
    );
}

export default DashboardPage;