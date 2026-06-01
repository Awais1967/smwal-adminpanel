import React from "react";
import EmptyState from "./EmptyState";

export default function TableEmptyState({
  colSpan = 1,
  title,
  description,
  icon,
  action,
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-6">
        <EmptyState
          title={title || "No results"}
          description={description || "Try adjusting your search or filters."}
          icon={icon}
          action={action}
          className="bg-transparent"
        />
      </td>
    </tr>
  );
}
