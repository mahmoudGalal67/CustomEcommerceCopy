"use client";

import { useGetUsersQuery, useDeleteUsersMutation } from "@/services/userApi";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useState, useMemo } from "react";


import SuccessModal from "@/components/SuccessModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertModal from "@/components/AlertModal";
import { useDebounce } from "@/hooks/useDebounce";
import UsersToolbar from "@/components/TableToolBar";


export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string>('');
  const [rowSelection, setRowSelection] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const selectedCount = useMemo(
    () => Object.keys(rowSelection).length,
    [rowSelection]
  );

  // 🔹 Debounce search
  const debouncedSearch = useDebounce(search, 300);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetUsersQuery({
    search: debouncedSearch,
    role: role == "undefined" ? "" : role,
  });

  const [deleteUsers] = useDeleteUsersMutation();

  const handleDeleteSelected = async () => {
    if (!selectedCount) return;

    try {
      setShowLoading(true);
      await deleteUsers({ ids: Object.keys(rowSelection), search, role }).unwrap();
      setShowSuccess(true);
      setRowSelection({});
    } finally {
      setShowLoading(false);
    }
  };

  const tableColumns = useMemo(() => columns, []);

  return (
    <div className="px-4 py-2">

      {/* 🔍 Filters */}
      <UsersToolbar
        title="Role"
        search={search}
        onSearchChange={setSearch}
        options={[
          'admin',
          'client',
          'seller'
        ]}
        role={role}
        onRoleChange={setRole}
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
        <p className="text-red-500 mt-2">Error loading users</p>
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
        title={`Delete ${selectedCount} users?`}
        description="Selected users will be permanently removed."
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
