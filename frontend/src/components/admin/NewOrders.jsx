import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { formatTime } from '../../lib/utils';
// import { format } from 'date-fns';

const OrderDetailsRow = ({ order }) => {
  return (
    <tr className="bg-gray-50 border-t">
      {/* 🔴 FIXED: Corrected colSpan to 7 to match table headers */}
      <td colSpan="7" className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Contact & Shipping
            </h4>
            <p>
              <strong>Email:</strong> {order.email}
            </p>
            <p>
              <strong>Phone:</strong> {order.phoneNumber}
            </p>
            <p>
              <strong>Address:</strong> {order.deliveryAddress}
            </p>
            {order.note && (
              <p>
                <strong>Note:</strong> {order.note}
              </p>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Products Ordered ({order.products.length})
            </h4>
            <div className="space-y-2">
              {order.products.map((item, index) => (
                <div key={index} className="bg-white p-2 rounded-lg shadow-sm">
                  <p>
                    <strong>Name:</strong> {item.name}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> ${item.price}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};

const NewOrders = () => {
  const {
    ordersData,
    isGettingOrders,
    getAllOrders,
    isMarkingOrderSeen,
    markOrderSeen,
    deleteOrder,
    isDeletingOrder,
  } = useAdminStore();
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);

  const toggleRow = (orderId) => {
    setExpandedOrderIds((prevIds) =>
      prevIds.includes(orderId)
        ? prevIds.filter((id) => id !== orderId)
        : [...prevIds, orderId]
    );
  };

  useEffect(() => {
    if (ordersData.allOrders.length === 0) {
      getAllOrders();
    }
  }, [getAllOrders, ordersData]);

  //   const unseenOrders = ordersData.allOrders.filter((order) => !order.seen);

  const handleSeen = (id) => {
    markOrderSeen(id);
  };

  const handleDelete = (id) => {
    deleteOrder(id);
  };

  if (isGettingOrders && ordersData.allOrders.length === 0) {
    return (
      <div className="flex justify-center items-center p-4 min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-primary">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-semibold mb-6 text-secondary font-[inter]">
        New Orders
      </h2>

      {/* <div className="flex space-x-4 mb-2">
        <div className="flex items-center">
          <h1>Unseen: </h1>
          <div className="ml-2 bg-yellow-100 h-5 w-5 border-gray-300 border-1"></div>
        </div>

        <div className="flex items-center">
          <h1>Seen: </h1>
          <div className="ml-2 bg-white  h-5 w-5 border-gray-300 border-1"></div>
        </div>
      </div> */}

      {/* Show message if there are no orders */}
      {!isGettingOrders && ordersData.newOrders.length === 0 && (
        <div className="text-center p-8 text-lg text-gray-500">
          No new orders found.
        </div>
      )}

      {/* 🟢 NEW: Mobile View (hidden on large screens) */}
      <div className=" space-y-4">
        {ordersData.newOrders.map((order) => (
          <div
            key={order._id}
            className={`rounded-none shadow-md p-4 space-y-2 border border-gray-200 ${
              order.seen === false ? 'bg-yellow-100' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs">Order ID</p>
                <p className="font-mono text-sm text-gray-900">
                  #{order._id.slice(-6)}
                </p>
              </div>
              <button
                onClick={() => toggleRow(order._id)}
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                {expandedOrderIds.includes(order._id) ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Customer</p>
                <p className="font-medium text-gray-900">{order.username}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total</p>
                <p className="font-medium text-gray-900">
                  ₦{order.totalPrice.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Status</p>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.orderStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Date</p>
                <p className="text-gray-900">{formatTime(order.createdAt)}</p>
              </div>
            </div>
            {expandedOrderIds.includes(order._id) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">
                    Contact & Shipping
                  </h4>
                  <p className="text-gray-700 text-sm">
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Phone:</strong> {order.phoneNumber}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <strong>Address:</strong> {order.deliveryAddress}
                  </p>
                  {order.note && (
                    <p className="text-gray-700 text-sm">
                      <strong>Note:</strong> {order.note}
                    </p>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold text-gray-800">
                    Products Ordered ({order.products.length})
                  </h4>
                  {order.products.map((item, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded-none">
                      <p className="text-sm">
                        <strong>Name:</strong> {item.name}
                      </p>
                      <p className="text-sm">
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                      <p className="text-sm">
                        <strong>Price:</strong> ₦{item.price}
                      </p>
                    </div>
                  ))}
                  {order.seen === false && order.orderStatus === 'paid' ? (
                    <button
                      className="w-full bg-success btn border-none rounded-none shadow-none "
                      onClick={() => handleSeen(order._id)}
                    >
                      {isMarkingOrderSeen ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        'Mark Seen'
                      )}
                    </button>
                  ) : null}
                  {order.orderStatus === 'pending' ? (
                    <button
                      className="w-full bg-error btn border-none rounded-none shadow-none "
                      onClick={() => handleDelete(order._id)}
                    >
                      {isDeletingOrder ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        'Delete'
                      )}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 🟢 NEW: Desktop View (hidden on small screens) */}
      <div className="hidden overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Order ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Items
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordersData.newOrders.map((order) => (
              <React.Fragment key={order._id}>
                <tr
                  className={`hover:bg-gray-50 transition-colors duration-200 ${
                    !order.seen ? 'bg-yellow-50' : ''
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-mono text-xs text-gray-500">
                      #{order._id.slice(-6)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.products.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.orderStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTime(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleRow(order._id)}
                      className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                      {expandedOrderIds.includes(order._id) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedOrderIds.includes(order._id) && (
                  <OrderDetailsRow order={order} />
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewOrders;
