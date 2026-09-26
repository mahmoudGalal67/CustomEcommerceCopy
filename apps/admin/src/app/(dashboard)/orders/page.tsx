"use client";

import { useGetOrdersQuery, useDeleteOrdersMutation, useGetSellerOrdersQuery } from "@/services/orderApi";
import { getColumns } from "./columns";
import { DataTable } from "./data-table";
import { useState, useMemo } from "react";


import SuccessModal from "@/components/SuccessModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertModal from "@/components/AlertModal";
import { useDebounce } from "@/hooks/useDebounce";
import OrdersToolbar from "@/components/TableToolBar";
import { useSelector } from "react-redux";


export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>('undefined');
  const [rowSelection, setRowSelection] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const user = useSelector((state: any) => state.auth.user);

const isAdmin = user?.role === "admin";
const isSeller = user?.role === "seller";

  const selectedCount = useMemo(
    () => Object.keys(rowSelection).length,
    [rowSelection]
  );

  // 🔹 Debounce search
  const debouncedSearch = useDebounce(search, 300);
  const queryArgs = {
  search: debouncedSearch,
  status,
};

const adminQuery = useGetOrdersQuery(queryArgs, {
  skip: !isAdmin,
});

const sellerQuery = useGetSellerOrdersQuery(queryArgs, {
  skip: !isSeller,
});

const ordersQuery = isAdmin ? adminQuery : sellerQuery;

const {
  data,
  isLoading,
  isFetching,
  isError,
  refetch,
} = ordersQuery;
  const [deleteOrders] = useDeleteOrdersMutation();

  const handleDeleteSelected = async () => {
    if (!selectedCount) return;

    try {
      setShowLoading(true);
      await deleteOrders({ ids: Object.keys(rowSelection), search, status }).unwrap();
      setShowSuccess(true);
      setRowSelection({});
    } finally {
      setShowLoading(false);
    }
  };

  const tableColumns = useMemo(() => {
  return getColumns(user?.role);
}, [user?.role]);
  

  return (
    <div className="px-4 py-2">

      {/* 🔍 Filters */}
      <OrdersToolbar
        search={search}
        onSearchChange={setSearch}
        onRoleChange={setStatus}
        selectedCount={selectedCount}
        onDeleteClick={() => setShowAlert(true)}
        isFetching={isFetching}
        onRefetch={refetch}
      />


      {/* 📊 Table */}
      <DataTable
        columns={tableColumns}
        data={data?.data ?? []}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        isLoading={isLoading}
        isFetching={isFetching}
        setIsLoadingModal={setShowLoading}
        onSuccess={() => setShowSuccess(true)}
      />

      {isError && (
        <p className="text-red-500 mt-2">Error loading orders</p>
      )}

      {/* ✅ Success */}
      <SuccessModal
        open={showSuccess}
        title="Done"
        description="Order processed successfully"
        onClose={() => setShowSuccess(false)}
      />

      {/* 🔄 Loading */}
      <LoadingSpinner
        open={showLoading}
        onClose={() => { }}
      />

      {/* ⚠️ Alert */}
      <AlertModal
        open={showAlert}
        title={`Delete ${selectedCount} orders?`}
        description="Selected orders will be permanently removed."
        onCancel={() => setShowAlert(false)}
        onConfirm={() => {
          handleDeleteSelected();
          setShowAlert(false);
        }}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
