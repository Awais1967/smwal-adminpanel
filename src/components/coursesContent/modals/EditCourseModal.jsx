import React from "react";
import CourseForm from "../CourseForm";
import CourseModalShell from "../_CourseModalShell";

export default function EditCourseModal({ open, onClose, course, onSave }) {
  return (
    <CourseModalShell
      open={open}
      onClose={onClose}
      title="Edit Course"
      subtitle="Update course information and lesson outline."
      showBack
    >
      <CourseForm
        key={course?.id || "course"}
        course={course}
        mode="edit"
        onCancel={onClose}
        onSubmit={onSave}
      />
    </CourseModalShell>
  );
}
