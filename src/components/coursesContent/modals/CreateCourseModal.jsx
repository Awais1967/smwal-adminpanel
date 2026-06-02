import React from "react";
import CourseForm from "../CourseForm";
import CourseModalShell from "../_CourseModalShell";

export default function CreateCourseModal({ open, onClose, onCreate }) {
  return (
    <CourseModalShell
      open={open}
      onClose={onClose}
      title="Create Course"
      subtitle="Add course details and build the embedded lesson outline."
      showBack
    >
      <CourseForm mode="create" onCancel={onClose} onSubmit={onCreate} />
    </CourseModalShell>
  );
}
