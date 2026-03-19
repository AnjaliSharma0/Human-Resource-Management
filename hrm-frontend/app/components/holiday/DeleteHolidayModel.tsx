"use client";

export default function DeleteHolidayModal({ holiday, close, onDelete }: any) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white p-6 rounded-xl w-[350px]">

        <h2 className="text-lg font-semibold mb-3">
          Delete Holiday
        </h2>

        <p className="mb-5">
          Are you sure you want to delete <b>{holiday.name}</b> ?
        </p>

        <div className="flex justify-end gap-3">

          <button
            onClick={close}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => onDelete(holiday.id)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}