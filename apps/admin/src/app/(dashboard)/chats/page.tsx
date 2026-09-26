"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useState, useMemo, useEffect } from "react";


import SuccessModal from "@/components/SuccessModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import AlertModal from "@/components/AlertModal";
import { useDebounce } from "@/hooks/useDebounce";
import UsersToolbar from "@/components/TableToolBar";
import { useDeleteCategoriesMutation } from "@/services/categorySlice";
import { useGetChatsQuery } from "@/services/ChatsApi";
import { initEcho } from "@/lib/bootstrap";


export default function ChatsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>('undefined');
  const [chats, setchats] = useState<Chat[]>([]);
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
  } = useGetChatsQuery({
    search: debouncedSearch,
    status,
  });
  type Chat = NonNullable<typeof data>[number];


  const [deleteCategories] = useDeleteCategoriesMutation();

  const handleDeleteSelected = async () => {
    if (!selectedCount) return;

    try {
      setShowLoading(true);
      await deleteCategories({ ids: Object.keys(rowSelection), search }).unwrap();
      setShowSuccess(true);
      setRowSelection({});
    } finally {
      setShowLoading(false);
    }
  };

  const tableColumns = useMemo(() => columns, []);

  useEffect(() => {
    if (data) {
      setchats(data.data);
    }
  }, [data]);

  useEffect(() => {
    const echo = initEcho();

    echo.channel("admin.support")
      .listen(".chat.updated", (chat: any) => {

        console.log(chat);

        setchats((prev: any[]) => {

          const exists = prev.find(
            (c) => c.id === chat.id
          );

          // update existing
          if (exists) {
            return prev.map((c) =>
              c.id === chat.id
                ? {
                  ...c,
                  ...chat,
                  unread_by_admin: chat.unread_by_admin,
                }
                : c
            );
          }

          // add new chat
          return [chat, ...prev];
        });
      });

    return () => {
      echo.leave("admin.support");
    };
  }, []);

  return (
    <div className="px-4 py-2">

      {/* 🔍 Filters */}
      <UsersToolbar
        title="Chats"
        options={['pending_admin', 'resolved', 'open']}
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
        //@ts-ignore
        columns={tableColumns}
        data={chats ?? []}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        isLoading={isLoading}
        isFetching={isFetching}
        setIsLoadingModal={setShowLoading}
        onSuccess={() => setShowSuccess(true)}
      />

      {isError && (
        <p className="text-red-500 mt-2">Error loading Chats</p>
      )}

      {/* ✅ Success */}
      <SuccessModal
        open={showSuccess}
        title="Chat"
        description="Chat processed successfully"
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
        title={`Delete ${selectedCount} Chats?`}
        description="Selected Chats will be permanently removed."
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
