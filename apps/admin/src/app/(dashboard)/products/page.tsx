"use client";

import { useGetProductsQuery, useDeleteProductsMutation } from "@/services/ProductSlice";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useState, useMemo } from "react";


import SuccessModal from "@/components/SuccessModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertModal from "@/components/AlertModal";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetCategoriesQuery } from "@/services/categorySlice";
import TablesToolbar from "@/components/TableToolBar";


export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>('undefined');
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
  } = useGetProductsQuery({
    search: debouncedSearch,
    category,
  });
  const {
    data: categories,
  } = useGetCategoriesQuery({});
  const [deleteProducts] = useDeleteProductsMutation();

  const handleDeleteSelected = async () => {
    if (!selectedCount) return;

    try {
      setShowLoading(true);
      await deleteProducts({ ids: Object.keys(rowSelection), search, category }).unwrap();
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
      <TablesToolbar
        search={search}
        title="Products"
        onSearchChange={setSearch}
        onRoleChange={setCategory}
        options={categories ? categories?.map((cat: any) => ({ ...cat, name: cat?.translations[0]?.name })) : []}
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
        onSuccess={() => setShowSuccess(true)}
      />

      {isError && (
        <p className="text-red-500 mt-2">Error loading orders</p>
      )}

      {/* ✅ Success */}
      <SuccessModal
        open={showSuccess}
        title="Done"
        description="Product processed successfully"
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
        title={`Delete ${selectedCount} Product?`}
        description="Selected Product will be permanently removed."
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
