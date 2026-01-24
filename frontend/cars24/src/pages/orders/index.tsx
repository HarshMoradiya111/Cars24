import React from "react";
import Link from "next/link";

const OrdersPage = () => (
  <div className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-orange-500">My orders</p>
          <h1 className="text-3xl font-bold">Track your purchases</h1>
          <p className="mt-2 text-sm text-gray-600">Stay updated on bookings, payments, and delivery steps.</p>
        </div>
        <Link
          href="/buy-car"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
        >
          Shop used cars
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="grid grid-cols-5 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
          <span>Order</span>
          <span>Car</span>
          <span>Status</span>
          <span>Amount</span>
          <span>Updated</span>
        </div>
        {[
          { id: "ORD-1024", car: "Hyundai Creta SX", status: "Payment pending", amount: "₹14.50 lakh", updated: "Today" },
          { id: "ORD-1019", car: "Maruti Swift VXI", status: "Inspection scheduled", amount: "₹6.80 lakh", updated: "Yesterday" },
        ].map((order) => (
          <div key={order.id} className="grid grid-cols-5 px-4 py-3 text-sm text-gray-800 odd:bg-white even:bg-gray-50">
            <span className="font-semibold text-gray-900">{order.id}</span>
            <span>{order.car}</span>
            <span className="font-medium text-blue-600">{order.status}</span>
            <span>{order.amount}</span>
            <span className="text-gray-500">{order.updated}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Need help? Visit the
        {" "}
        <Link href="/faq" className="font-semibold text-blue-600 hover:text-blue-700">
          FAQ page
        </Link>
        {" "}or chat with support.
      </p>
    </div>
  </div>
);

export default OrdersPage;
