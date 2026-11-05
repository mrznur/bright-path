import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { courses } from '@/data/courses';
import { teachers } from '@/data/teachers';
import { testimonials } from '@/data/testimonials';
import { faqs } from '@/data/faqs';
import { SITE } from '@/data/site';

type CourseInput = { title: string; titleBn: string; level: string; classes: string; subject: string; description: string; monthlyFee: number };
type BatchInput = { courseId: string; teacherName: string; days: string; time: string; capacity: number };
export type EnquiryInput = { name: string; phone: string; classLevel: string; subject: string; course: string; question: string };
export type BookingInput = {
  courseId: string;
  batchId: string;
  parentName: string;
  studentName: string;
  phone: string;
  classLevel: string;
  paymentMethod: string;
  note: string;
};

let publicContentCache: { value: Awaited<ReturnType<typeof loadPublicContent>>; expiresAt: number } | null = null;

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_PUBLIC_CONFIG_MISSING');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function getAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('SUPABASE_SERVICE_ROLE_CONFIG_MISSING');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function mapCourse(row: Record<string, unknown>) {
  return {
    id: row.id, title: row.title, titleBn: row.title_bn, level: row.level, levelBn: row.level_bn,
    classes: row.classes, classesBn: row.classes_bn, subject: row.subject, subjectBn: row.subject_bn,
    description: row.description, descriptionBn: row.description_bn, monthlyFee: row.monthly_fee, active: row.active,
  };
}

function mapBatch(row: Record<string, unknown>) {
  return {
    id: row.id, courseId: row.course_id, teacherName: row.teacher_name, teacherNameBn: row.teacher_name_bn,
    days: row.days, daysBn: row.days_bn, time: row.time, timeBn: row.time_bn,
    capacity: row.capacity, enrolledCount: row.enrolled_count, active: row.active,
  };
}

async function assertOk<T>(result: { data: T; error: { message: string } | null }) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

async function loadPublicContent() {
  const db = getPublicClient();
  const [courseResult, teacherResult, testimonialResult, faqResult, settingsResult] = await Promise.all([
    db.from('courses').select('*, batches(*)').eq('active', true).order('created_at', { ascending: false }),
    db.from('teachers').select('*').eq('active', true).order('id'),
    db.from('testimonials').select('*').eq('active', true).order('id'),
    db.from('faqs').select('*').eq('active', true).order('display_order'),
    db.from('site_settings').select('data').eq('id', 1).single(),
  ]);
  const courseRows = await assertOk(courseResult) as (Record<string, unknown> & { batches: Record<string, unknown>[] })[];
  const teachersRows = await assertOk(teacherResult) as Record<string, unknown>[];
  const testimonialRows = await assertOk(testimonialResult) as Record<string, unknown>[];
  const faqRows = await assertOk(faqResult) as Record<string, unknown>[];
  const settings = await assertOk(settingsResult) as { data: Record<string, unknown> };
  return {
    courses: courseRows.flatMap((course) => {
      const batches = course.batches || [];
      return (batches.length ? batches : [null]).map((batch) => ({
        enrolledCount: batch ? Number(batch.enrolled_count) : 0,
        batchSize: batch ? Number(batch.capacity) : 0,
        ...mapCourse(course),
        batchId: batch ? String(batch.id) : undefined,
        teacherName: batch ? batch.teacher_name : '', teacherNameBn: batch ? batch.teacher_name_bn : '',
        days: batch ? batch.days : '', daysBn: batch ? batch.days_bn : '', time: batch ? batch.time : '', timeBn: batch ? batch.time_bn : '',
        isFull: batch ? Number(batch.enrolled_count) >= Number(batch.capacity) : false,
      }));
    }),
    teachers: teachersRows.map((row) => ({ id: row.id, name: row.name, subject: row.subject, qualifications: row.qualifications, bio: row.bio, photo: row.photo })),
    testimonials: testimonialRows.map((row) => ({ id: row.id, parentName: row.parent_name, parentNameBn: row.parent_name_bn, parentRole: row.parent_role, parentRoleBn: row.parent_role_bn, quote: row.quote, quoteBn: row.quote_bn })),
        faqs: faqRows.map((row) => ({ id: row.id, question: row.question, answer: row.answer, order: row.display_order, questionBn: row.question_bn ?? null, answerBn: row.answer_bn ?? null })),
    site: settings.data,
  };
}

export async function getPublicContent() {
  if (publicContentCache && publicContentCache.expiresAt > Date.now()) return publicContentCache.value;
  const value = await loadPublicContent();
  publicContentCache = { value, expiresAt: Date.now() + 30_000 };
  return value;
}

export function clearPublicContentCache() {
  publicContentCache = null;
}

export async function getDashboardStats() {
  const db = getAdminClient();
  const [coursesResult, batchesResult] = await Promise.all([
    db.from('courses').select('id', { count: 'exact', head: true }).eq('active', true),
    db.from('batches').select('capacity, enrolled_count').eq('active', true),
  ]);
  await assertOk(coursesResult);
  const batches = await assertOk(batchesResult) as { capacity: number; enrolled_count: number }[];
  const totalCapacity = batches.reduce((sum, item) => sum + item.capacity, 0);
  const enrolled = batches.reduce((sum, item) => sum + item.enrolled_count, 0);
  return { activeCourses: coursesResult.count || 0, totalCapacity, enrolled, availableSeats: totalCapacity - enrolled, capacityUsed: totalCapacity ? Math.round(enrolled / totalCapacity * 100) : 0 };
}

export async function listCourses() {
  const result = await assertOk(await getAdminClient().from('courses').select('*, batches(*)').eq('active', true).order('created_at', { ascending: false })) as (Record<string, unknown> & { batches: Record<string, unknown>[] })[];
  return result.map((row) => ({ ...mapCourse(row), batches: (row.batches || []).filter((batch) => batch.active).map(mapBatch) }));
}

export async function createCourse(input: CourseInput) {
  const row = await assertOk(await getAdminClient().from('courses').insert({
    title: input.title, title_bn: input.titleBn, level: input.level, classes: input.classes, subject: input.subject,
    description: input.description, monthly_fee: input.monthlyFee,
  }).select().single()) as Record<string, unknown>;
  clearPublicContentCache();
  return mapCourse(row);
}

export async function listBatches() {
  const rows = await assertOk(await getAdminClient().from('batches').select('*, courses(id, title)').eq('active', true).order('created_at', { ascending: false })) as Record<string, unknown>[];
  return rows.map((row) => ({ ...mapBatch(row), course: row.courses }));
}

export async function createBatch(input: BatchInput) {
  const course = await assertOk(await getAdminClient().from('courses').select('id').eq('id', input.courseId).eq('active', true).maybeSingle());
  if (!course) throw new Error('COURSE_NOT_FOUND');
  const row = await assertOk(await getAdminClient().from('batches').insert({
    course_id: input.courseId, teacher_name: input.teacherName, days: input.days, time: input.time, capacity: input.capacity,
  }).select().single()) as Record<string, unknown>;
  clearPublicContentCache();
  return mapBatch(row);
}

export async function createEnquiry(input: EnquiryInput) {
  await assertOk(await getPublicClient().from('enquiries').insert({
    name: input.name, phone: input.phone, class_level: input.classLevel, subject: input.subject, course: input.course, question: input.question,
  }));
  return { id: 'pending' };
}

export async function createBooking(input: BookingInput) {
  const db = getPublicClient();
  const batch = await assertOk(await db.from('batches').select('id, course_id, capacity, enrolled_count').eq('id', input.batchId).eq('course_id', input.courseId).eq('active', true).maybeSingle()) as { id: string; course_id: string; capacity: number; enrolled_count: number } | null;
  if (!batch || batch.enrolled_count >= batch.capacity) throw new Error('BATCH_UNAVAILABLE');
  await assertOk(await db.from('bookings').insert({
    batch_id: input.batchId, course_id: input.courseId, parent_name: input.parentName, student_name: input.studentName,
    phone: input.phone, class_level: input.classLevel, payment_method: input.paymentMethod, note: input.note,
  }));
  return { id: 'pending' };
}

export async function listBookings() {
  return assertOk(await getAdminClient().from('bookings').select('id, batchId:batch_id, courseId:course_id, parentName:parent_name, studentName:student_name, phone, classLevel:class_level, paymentMethod:payment_method, note, status, createdAt:created_at, courses(title), batches(teacher_name, days, time)').order('created_at', { ascending: false }));
}

export async function listEnquiries() {
  const rows = await assertOk(await getAdminClient().from('enquiries').select('id, name, phone, classLevel:class_level, subject, course, question, status, createdAt:created_at').order('created_at', { ascending: false }));
  return rows;
}

export async function getAdminContent() {
  const db = getAdminClient();
  const [teachersResult, testimonialsResult, faqsResult, siteResult] = await Promise.all([
    db.from('teachers').select('*').order('id'), db.from('testimonials').select('*').order('id'),
    db.from('faqs').select('*').order('display_order'), db.from('site_settings').select('data').eq('id', 1).single(),
  ]);
  const teachersRows = await assertOk(teachersResult) as Record<string, unknown>[];
  return {
    teachers: teachersRows, testimonials: await assertOk(testimonialsResult), faqs: await assertOk(faqsResult),
    site: (await assertOk(siteResult) as { data: Record<string, unknown> }).data,
  };
}

export async function updateTeacher(id: string, input: { name: string; subject: string; qualifications: string[]; bio: string; photo: string }) {
  await assertOk(await getAdminClient().from('teachers').update({ name: input.name, subject: input.subject, qualifications: input.qualifications, bio: input.bio, photo: input.photo }).eq('id', id));
  clearPublicContentCache();
}
export async function updateTestimonial(id: string, input: Record<string, string>) {
  await assertOk(await getAdminClient().from('testimonials').update({ parent_name: input.parentName, parent_name_bn: input.parentNameBn, parent_role: input.parentRole, parent_role_bn: input.parentRoleBn, quote: input.quote, quote_bn: input.quoteBn }).eq('id', id));
  clearPublicContentCache();
}
export async function updateFaq(id: string, input: { question: string; answer: string; displayOrder: number }) {
  await assertOk(await getAdminClient().from('faqs').update({ question: input.question, answer: input.answer, display_order: input.displayOrder }).eq('id', id));
  clearPublicContentCache();
}
export async function updateSiteSettings(input: Record<string, unknown>) {
  await assertOk(await getAdminClient().from('site_settings').upsert({ id: 1, data: input }));
  clearPublicContentCache();
}

export async function createTeacher(input: { name: string; subject: string; qualifications: string[]; bio: string; photo: string }) {
  const id = crypto.randomUUID();
  await assertOk(await getAdminClient().from('teachers').insert({ id, name: input.name, subject: input.subject, qualifications: input.qualifications, bio: input.bio, photo: input.photo, active: true }));
  clearPublicContentCache();
  return { id, ...input };
}
export async function createTestimonial(input: { parentName: string; parentNameBn: string; parentRole: string; parentRoleBn: string; quote: string; quoteBn: string }) {
  const id = crypto.randomUUID();
  await assertOk(await getAdminClient().from('testimonials').insert({ id, parent_name: input.parentName, parent_name_bn: input.parentNameBn, parent_role: input.parentRole, parent_role_bn: input.parentRoleBn, quote: input.quote, quote_bn: input.quoteBn, active: true }));
  clearPublicContentCache();
  return { id, ...input };
}
export async function createFaq(input: { question: string; answer: string; displayOrder: number }) {
  const id = crypto.randomUUID();
  await assertOk(await getAdminClient().from('faqs').insert({ id, question: input.question, answer: input.answer, display_order: input.displayOrder, active: true }));
  clearPublicContentCache();
  return { id, ...input };
}

export async function seedSupabase() {
  const db = getAdminClient();
  const existing = await assertOk(await db.from('courses').select('id').limit(1));
  if ((existing || []).length) return false;
  await assertOk(await db.from('courses').insert(courses.map((course) => ({
    id: course.id, title: course.title, title_bn: course.titleBn, level: course.level, level_bn: course.levelBn,
    classes: course.classes, classes_bn: course.classesBn, subject: course.subject, subject_bn: course.subjectBn,
    description: course.description, description_bn: course.descriptionBn, monthly_fee: course.monthlyFee,
  }))));
  await assertOk(await db.from('batches').insert(courses.map((course) => ({
    id: `seed-${course.id}`, course_id: course.id, teacher_name: course.teacherName, teacher_name_bn: course.teacherNameBn,
    days: course.days, days_bn: course.daysBn, time: course.time, time_bn: course.timeBn, capacity: course.batchSize, enrolled_count: course.enrolledCount,
  }))));
  await assertOk(await db.from('teachers').insert(teachers.map((item) => ({ ...item, qualifications: item.qualifications }))));
  await assertOk(await db.from('testimonials').insert(testimonials.map((item) => ({ id: item.id, parent_name: item.parentName, parent_name_bn: item.parentNameBn, parent_role: item.parentRole, parent_role_bn: item.parentRoleBn, quote: item.quote, quote_bn: item.quoteBn }))));
  await assertOk(await db.from('faqs').insert(faqs.map((item) => ({ id: item.id, question: item.question, answer: item.answer, display_order: item.order }))));
  await assertOk(await db.from('site_settings').upsert({ id: 1, data: SITE }));
  return true;
}

// ── Status updates & deactivation ──────────────────────────────────
export async function updateEnquiryStatus(id: string, status: string) {
  await assertOk(await getAdminClient().from('enquiries').update({ status }).eq('id', id));
}

export async function updateBookingStatus(id: string, status: string) {
  await assertOk(await getAdminClient().from('bookings').update({ status }).eq('id', id));
}

export async function deactivateCourse(id: string) {
  await assertOk(await getAdminClient().from('courses').update({ active: false }).eq('id', id));
  clearPublicContentCache();
}

export async function deactivateBatch(id: string) {
  await assertOk(await getAdminClient().from('batches').update({ active: false }).eq('id', id));
  clearPublicContentCache();
}
