import type { Batch, Course } from "@/types";

export function courseSeatSummary(course: Course) {
    const batches = course.batches ?? [];
    const batchSize = batches.reduce((sum, b) => sum + b.batchSize, 0);
    const enrolledCount = batches.reduce((sum, b) => sum + b.enrolledCount, 0);
    const isFull = batches.length > 0 && batches.every((b) => b.isFull || b.enrolledCount >= b.batchSize);
    const primary: Batch | undefined = batches.find((b) => !b.isFull && b.enrolledCount < b.batchSize) ?? batches[0];
    return { batchSize, enrolledCount, isFull, primary, batchCount: batches.length };
}

export function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
