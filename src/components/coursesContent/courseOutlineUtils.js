const mongoIdPattern = /^[a-f\d]{24}$/i;

export const isMongoId = (value) => mongoIdPattern.test(String(value || ""));

export const cleanLessonOutline = (lessons = []) =>
  lessons.map((lesson) => {
    const cleaned = {
      coverPhoto: String(lesson.coverPhoto || "").trim(),
      title: String(lesson.title || "").trim(),
      description: String(lesson.description || "").trim(),
      type: String(lesson.type || "").trim(),
      summary: String(lesson.summary || "").trim(),
      duration: String(lesson.duration || "").trim(),
      attachmentUrl: String(lesson.attachmentUrl || "").trim(),
      status: lesson.status || "Draft",
      reflectionText: String(lesson.reflectionText || "").trim(),
      keyTakeaways: (lesson.keyTakeaways || [])
        .map((item) => String(item || "").trim())
        .filter(Boolean),
    };

    if (isMongoId(lesson.id || lesson._id)) {
      cleaned.id = lesson.id || lesson._id;
    }

    return cleaned;
  });

export const validateLessonOutline = (lessons = []) => {
  const missingIndex = lessons.findIndex(
    (lesson) => !lesson.title?.trim() || !lesson.type?.trim() || !lesson.status,
  );

  if (missingIndex >= 0) {
    return `Lesson ${missingIndex + 1} needs title, type, and status.`;
  }

  const invalidTypeIndex = lessons.findIndex(
    (lesson) => !["Audio", "Video"].includes(lesson.type),
  );

  if (invalidTypeIndex >= 0) {
    return `Lesson ${invalidTypeIndex + 1} type must be Audio or Video.`;
  }

  return "";
};
