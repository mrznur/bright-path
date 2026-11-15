import { neon } from "@neondatabase/serverless";
import type {
    Course,
    Batch,
    Teacher,
    Testimonial,
    FAQ,
    StudentResult,
    Booking,
    Enquiry,
    DashboardStats,
    SiteConfig,
    CourseInput,
} from "@/types";
import { courses as seedCourses } from "@/data/courses";
import { teachers as seedTeachers } from "@/data/teachers";
import { testimonials as seedTestimonials } from "@/data/testimonials";
import { faqs as seedFaqs } from "@/data/faqs";
import { results as seedResults } from "@/data/results";
import { SITE } from "@/data/site";

function getSql() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL env var is not set");
    }
    return neon(connectionString);
}

function isDbConfigured(): boolean {
    return !!process.env.DATABASE_URL;
}

type DbRow = Record<string, unknown>;

function mapBatch(row: DbRow): Batch {
    return {
        id: row.id as string,
        courseId: row.course_id as string,
        days: (row.days as string) ?? "",
        daysBn: (row.days_bn as string) ?? "",
        time: (row.time as string) ?? "",
        timeBn: (row.time_bn as string) ?? "",
        batchSize: Number(row.batch_size) || 0,
        enrolledCount: Number(row.enrolled_count) || 0,
        isFull: Boolean(row.is_full),
    };
}

function mapTeacher(row: DbRow): Teacher {
    return {
        id: row.id as string,
        name: row.name as string,
        nameBn: row.name_bn as string,
        subject: row.subject as string,
        subjectBn: row.subject_bn as string,
        bio: row.bio as string,
        bioBn: row.bio_bn as string,
        imageUrl: (row.image_url as string | undefined) ?? undefined,
    };
}

function mapCourseRow(row: DbRow, batches: Batch[], teacher?: Teacher | null): Course {
    return {
        id: row.id as string,
        title: row.title as string,
        titleBn: (row.title_bn as string) ?? "",
        level: row.level as Course["level"],
        levelBn: (row.level_bn as string) ?? "",
        classes: (row.classes as string) ?? "",
        classesBn: (row.classes_bn as string) ?? "",
        subject: (row.subject as string) ?? "",
        subjectBn: (row.subject_bn as string) ?? "",
        description: (row.description as string) ?? "",
        descriptionBn: (row.description_bn as string) ?? "",
        teacherId: (row.teacher_id as string) ?? "",
        teacherName: teacher?.name ?? (row.teacher_name as string) ?? "",
        teacherNameBn: teacher?.nameBn ?? (row.teacher_name_bn as string) ?? "",
        monthlyFee: Number(row.monthly_fee) || 0,
        batches,
    };
}

function mapLegacyCourse(row: DbRow, teacher?: Teacher | null): Course {
    const batch: Batch = {
        id: ((row.batch_id as string) || `${row.id}-a`) as string,
        courseId: row.id as string,
        days: (row.days as string) ?? "",
        daysBn: (row.days_bn as string) ?? "",
        time: (row.time as string) ?? "",
        timeBn: (row.time_bn as string) ?? "",
        batchSize: Number(row.batch_size) || 15,
        enrolledCount: Number(row.enrolled_count) || 0,
        isFull: Boolean(row.is_full),
    };
    return mapCourseRow(row, [batch], teacher);
}

function mapTestimonial(row: DbRow): Testimonial {
    return {
        id: row.id as string,
        quote: row.quote as string,
        quoteBn: row.quote_bn as string,
        author: row.author as string,
        authorBn: row.author_bn as string,
        role: row.role as string,
        roleBn: row.role_bn as string,
    };
}

function mapFaq(row: DbRow): FAQ {
    return {
        id: row.id as string,
        question: row.question as string,
        questionBn: row.question_bn as string,
        answer: row.answer as string,
        answerBn: row.answer_bn as string,
        sortOrder: Number(row.sort_order) || 0,
    };
}

function mapResult(row: DbRow): StudentResult {
    return {
        id: row.id as string,
        studentName: row.student_name as string,
        studentNameBn: row.student_name_bn as string,
        exam: row.exam as string,
        examBn: row.exam_bn as string,
        subject: row.subject as string,
        subjectBn: row.subject_bn as string,
        grade: row.grade as string,
        gradeBn: row.grade_bn as string,
        year: row.year as number,
    };
}

function mapBooking(row: DbRow): Booking {
    return {
        id: row.id as string,
        courseId: row.course_id as string,
        batchId: row.batch_id as string,
        parentName: row.parent_name as string,
        studentName: row.student_name as string,
        phone: row.phone as string,
        classLevel: row.class_level as string,
        paymentMethod: row.payment_method as string,
        note: (row.note as string) ?? "",
        status: row.status as Booking["status"],
        createdAt: row.created_at as string,
    };
}

function mapEnquiry(row: DbRow): Enquiry {
    return {
        id: row.id as string,
        name: row.name as string,
        phone: row.phone as string,
        classLevel: row.class_level as string,
        subject: row.subject as string,
        course: row.course as string,
        question: (row.question as string) ?? "",
        status: row.status as Enquiry["status"],
        createdAt: row.created_at as string,
    };
}

function mapSite(row: DbRow): SiteConfig {
    return {
        name: (row.name as string) || SITE.name,
        tagline: { en: (row.tagline_en as string) || SITE.tagline.en, bn: (row.tagline_bn as string) || SITE.tagline.bn },
        phone: { en: (row.phone_en as string) || SITE.phone.en, bn: (row.phone_bn as string) || SITE.phone.bn },
        tel: (row.tel as string) || SITE.tel,
        address: { en: (row.address_en as string) || SITE.address.en, bn: (row.address_bn as string) || SITE.address.bn },
        mapLink: (row.map_link as string) || SITE.mapLink,
        hours: { en: (row.hours_en as string) || SITE.hours.en, bn: (row.hours_bn as string) || SITE.hours.bn },
        facebook: (row.facebook as string) || SITE.facebook,
    };
}

async function loadAssembledCourses(): Promise<Course[]> {
    const sql = getSql();
    const [courseRows, teacherRows] = await Promise.all([
        sql`SELECT * FROM courses ORDER BY level, title`,
        sql`SELECT * FROM teachers ORDER BY name`,
    ]);
    if (!courseRows.length) return seedCourses;

    const teachers = teacherRows.map((r) => mapTeacher(r as DbRow));
    const teacherById = new Map(teachers.map((t) => [t.id, t]));

    let batchRows: DbRow[] = [];
    try {
        batchRows = (await sql`SELECT * FROM batches ORDER BY days, time`) as DbRow[];
    } catch {
        return courseRows.map((row) => {
            const r = row as DbRow;
            return mapLegacyCourse(r, teacherById.get((r.teacher_id as string) ?? ""));
        });
    }

    if (!batchRows.length && courseRows[0] && "batch_id" in (courseRows[0] as DbRow)) {
        return courseRows.map((row) => {
            const r = row as DbRow;
            return mapLegacyCourse(r, teacherById.get((r.teacher_id as string) ?? ""));
        });
    }

    const byCourse = new Map<string, Batch[]>();
    for (const row of batchRows) {
        const batch = mapBatch(row);
        const list = byCourse.get(batch.courseId) ?? [];
        list.push(batch);
        byCourse.set(batch.courseId, list);
    }

    return courseRows.map((row) => {
        const r = row as DbRow;
        const id = r.id as string;
        return mapCourseRow(r, byCourse.get(id) ?? [], teacherById.get((r.teacher_id as string) ?? ""));
    });
}

export async function getPublicContent() {
    if (!isDbConfigured()) {
        return {
            courses: seedCourses,
            teachers: seedTeachers,
            testimonials: seedTestimonials,
            faqs: seedFaqs,
            results: seedResults,
            site: SITE,
        };
    }

    const sql = getSql();

    const [courses, teacherRows, testimonialRows, faqRows, resultRows, site] = await Promise.all([
        loadAssembledCourses(),
        sql`SELECT * FROM teachers ORDER BY name`,
        sql`SELECT * FROM testimonials ORDER BY id`,
        sql`SELECT * FROM faqs ORDER BY sort_order, id`,
        sql`SELECT * FROM results ORDER BY year DESC`,
        getSiteConfig(),
    ]);

    return {
        courses,
        teachers: teacherRows.length ? teacherRows.map((r) => mapTeacher(r as DbRow)) : seedTeachers,
        testimonials: testimonialRows.length ? testimonialRows.map((r) => mapTestimonial(r as DbRow)) : seedTestimonials,
        faqs: faqRows.length ? faqRows.map((r) => mapFaq(r as DbRow)) : seedFaqs,
        results: resultRows.length ? resultRows.map((r) => mapResult(r as DbRow)) : seedResults,
        site,
    };
}

export async function getSiteConfig(): Promise<SiteConfig> {
    if (!isDbConfigured()) return SITE;
    try {
        const sql = getSql();
        const rows = await sql`SELECT * FROM site_config WHERE id = 'default'`;
        return rows[0] ? mapSite(rows[0] as DbRow) : SITE;
    } catch {
        return SITE;
    }
}

export async function updateSiteConfig(data: SiteConfig): Promise<SiteConfig> {
    const sql = getSql();
    const rows = await sql`
        INSERT INTO site_config (
            id, name, tagline_en, tagline_bn, phone_en, phone_bn, tel,
            address_en, address_bn, map_link, hours_en, hours_bn, facebook
        ) VALUES (
            'default', ${data.name}, ${data.tagline.en}, ${data.tagline.bn},
            ${data.phone.en}, ${data.phone.bn}, ${data.tel},
            ${data.address.en}, ${data.address.bn}, ${data.mapLink},
            ${data.hours.en}, ${data.hours.bn}, ${data.facebook}
        )
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            tagline_en = EXCLUDED.tagline_en,
            tagline_bn = EXCLUDED.tagline_bn,
            phone_en = EXCLUDED.phone_en,
            phone_bn = EXCLUDED.phone_bn,
            tel = EXCLUDED.tel,
            address_en = EXCLUDED.address_en,
            address_bn = EXCLUDED.address_bn,
            map_link = EXCLUDED.map_link,
            hours_en = EXCLUDED.hours_en,
            hours_bn = EXCLUDED.hours_bn,
            facebook = EXCLUDED.facebook
        RETURNING *
    `;
    return mapSite(rows[0] as DbRow);
}

export async function createBooking(data: Omit<Booking, "id" | "status" | "createdAt">) {
    const sql = getSql();
    await sql`
        INSERT INTO bookings (course_id, batch_id, parent_name, student_name, phone, class_level, payment_method, note, status, created_at)
        VALUES (${data.courseId}, ${data.batchId}, ${data.parentName}, ${data.studentName}, ${data.phone}, ${data.classLevel}, ${data.paymentMethod}, ${data.note}, 'pending', now())
    `;
}

export async function listBookings(): Promise<Booking[]> {
    const sql = getSql();
    const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
    return rows.map((r) => mapBooking(r as DbRow));
}

async function adjustBatchSeats(batchId: string, delta: number) {
    const sql = getSql();
    try {
        await sql`
            UPDATE batches SET
                enrolled_count = GREATEST(0, enrolled_count + ${delta}),
                is_full = (GREATEST(0, enrolled_count + ${delta}) >= batch_size)
            WHERE id = ${batchId}
        `;
    } catch {
        await sql`
            UPDATE courses SET
                enrolled_count = GREATEST(0, enrolled_count + ${delta}),
                is_full = (GREATEST(0, enrolled_count + ${delta}) >= batch_size)
            WHERE batch_id = ${batchId} OR id = ${batchId}
        `;
    }
}

export async function updateBookingStatus(id: string, status: Booking["status"]) {
    const sql = getSql();
    const rows = await sql`SELECT * FROM bookings WHERE id = ${id}`;
    const current = rows[0] as DbRow | undefined;
    if (!current) return;
    const prev = current.status as Booking["status"];
    await sql`UPDATE bookings SET status = ${status} WHERE id = ${id}`;
    if (prev !== "confirmed" && status === "confirmed") {
        await adjustBatchSeats(current.batch_id as string, 1);
    } else if (prev === "confirmed" && status !== "confirmed") {
        await adjustBatchSeats(current.batch_id as string, -1);
    }
}

export async function deleteBooking(id: string): Promise<void> {
    const sql = getSql();
    const rows = await sql`SELECT * FROM bookings WHERE id = ${id}`;
    const current = rows[0] as DbRow | undefined;
    if (current?.status === "confirmed") {
        await adjustBatchSeats(current.batch_id as string, -1);
    }
    await sql`DELETE FROM bookings WHERE id = ${id}`;
}

export async function createEnquiry(data: Omit<Enquiry, "id" | "status" | "createdAt">) {
    const sql = getSql();
    await sql`
        INSERT INTO enquiries (name, phone, class_level, subject, course, question, status, created_at)
        VALUES (${data.name}, ${data.phone}, ${data.classLevel}, ${data.subject}, ${data.course}, ${data.question}, 'new', now())
    `;
}

export async function listEnquiries(): Promise<Enquiry[]> {
    const sql = getSql();
    const rows = await sql`SELECT * FROM enquiries ORDER BY created_at DESC`;
    return rows.map((r) => mapEnquiry(r as DbRow));
}

export async function updateEnquiryStatus(id: string, status: Enquiry["status"]) {
    const sql = getSql();
    await sql`UPDATE enquiries SET status = ${status} WHERE id = ${id}`;
}

export async function deleteEnquiry(id: string): Promise<void> {
    const sql = getSql();
    await sql`DELETE FROM enquiries WHERE id = ${id}`;
}

export async function getDashboardStats(): Promise<DashboardStats> {
    const sql = getSql();

    const [totalRow] = await sql`SELECT count(*)::int AS count FROM bookings`;
    const [confirmedRow] = await sql`SELECT count(*)::int AS count FROM bookings WHERE status = 'confirmed'`;
    const [pendingRow] = await sql`SELECT count(*)::int AS count FROM bookings WHERE status = 'pending'`;
    const [enquiryTotalRow] = await sql`SELECT count(*)::int AS count FROM enquiries`;
    const [newEnquiryRow] = await sql`SELECT count(*)::int AS count FROM enquiries WHERE status = 'new'`;

    return {
        totalBookings: (totalRow?.count as number) ?? 0,
        confirmedBookings: (confirmedRow?.count as number) ?? 0,
        pendingBookings: (pendingRow?.count as number) ?? 0,
        totalEnquiries: (enquiryTotalRow?.count as number) ?? 0,
        newEnquiries: (newEnquiryRow?.count as number) ?? 0,
    };
}

export async function listCourses(): Promise<Course[]> {
    if (!isDbConfigured()) return seedCourses;
    try {
        return await loadAssembledCourses();
    } catch {
        return seedCourses;
    }
}

export async function createCourse(data: CourseInput): Promise<Course> {
    const sql = getSql();
    const teacherId = data.teacherId || null;
    const rows = await sql`
        INSERT INTO courses (id, title, title_bn, level, level_bn, classes, classes_bn,
            subject, subject_bn, description, description_bn, teacher_id, monthly_fee)
        VALUES (${data.id}, ${data.title}, ${data.titleBn}, ${data.level}, ${data.levelBn},
            ${data.classes}, ${data.classesBn}, ${data.subject}, ${data.subjectBn},
            ${data.description}, ${data.descriptionBn}, ${teacherId}, ${data.monthlyFee})
        RETURNING *
    `;
    const teachers = await listTeachers();
    const teacher = teachers.find((t) => t.id === data.teacherId) ?? null;
    return mapCourseRow(rows[0] as DbRow, [], teacher);
}

export async function updateCourse(id: string, data: Partial<CourseInput>): Promise<Course> {
    const sql = getSql();
    const teacherId = data.teacherId === undefined ? null : data.teacherId || null;
    const rows = await sql`
        UPDATE courses SET
            title          = COALESCE(${data.title ?? null}, title),
            title_bn       = COALESCE(${data.titleBn ?? null}, title_bn),
            level          = COALESCE(${data.level ?? null}, level),
            level_bn       = COALESCE(${data.levelBn ?? null}, level_bn),
            classes        = COALESCE(${data.classes ?? null}, classes),
            classes_bn     = COALESCE(${data.classesBn ?? null}, classes_bn),
            subject        = COALESCE(${data.subject ?? null}, subject),
            subject_bn     = COALESCE(${data.subjectBn ?? null}, subject_bn),
            description    = COALESCE(${data.description ?? null}, description),
            description_bn = COALESCE(${data.descriptionBn ?? null}, description_bn),
            teacher_id     = COALESCE(${teacherId}, teacher_id),
            monthly_fee    = COALESCE(${data.monthlyFee ?? null}, monthly_fee)
        WHERE id = ${id}
        RETURNING *
    `;
    const assembled = await loadAssembledCourses();
    return assembled.find((c) => c.id === id) ?? mapCourseRow(rows[0] as DbRow, [], null);
}

export async function deleteCourse(id: string): Promise<void> {
    const sql = getSql();
    await sql`DELETE FROM courses WHERE id = ${id}`;
}

export async function listBatches(): Promise<Batch[]> {
    const sql = getSql();
    const rows = await sql`SELECT * FROM batches ORDER BY course_id, days`;
    return rows.map((r) => mapBatch(r as DbRow));
}

export async function createBatch(data: Batch): Promise<Batch> {
    const sql = getSql();
    const isFull = data.isFull || data.enrolledCount >= data.batchSize;
    const rows = await sql`
        INSERT INTO batches (id, course_id, days, days_bn, time, time_bn, batch_size, enrolled_count, is_full)
        VALUES (${data.id}, ${data.courseId}, ${data.days}, ${data.daysBn}, ${data.time}, ${data.timeBn},
            ${data.batchSize}, ${data.enrolledCount}, ${isFull})
        RETURNING *
    `;
    return mapBatch(rows[0] as DbRow);
}

export async function updateBatch(id: string, data: Partial<Omit<Batch, "id">>): Promise<Batch> {
    const sql = getSql();
    const rows = await sql`
        UPDATE batches SET
            course_id      = COALESCE(${data.courseId ?? null}, course_id),
            days           = COALESCE(${data.days ?? null}, days),
            days_bn        = COALESCE(${data.daysBn ?? null}, days_bn),
            time           = COALESCE(${data.time ?? null}, time),
            time_bn        = COALESCE(${data.timeBn ?? null}, time_bn),
            batch_size     = COALESCE(${data.batchSize ?? null}, batch_size),
            enrolled_count = COALESCE(${data.enrolledCount ?? null}, enrolled_count),
            is_full        = COALESCE(${data.isFull ?? null}, is_full)
        WHERE id = ${id}
        RETURNING *
    `;
    return mapBatch(rows[0] as DbRow);
}

export async function deleteBatch(id: string): Promise<void> {
    const sql = getSql();
    await sql`DELETE FROM batches WHERE id = ${id}`;
}

export async function listTeachers(): Promise<Teacher[]> {
    if (!isDbConfigured()) return seedTeachers;
    const sql = getSql();
    const rows = await sql`SELECT * FROM teachers ORDER BY name`;
    return rows.length ? rows.map((r) => mapTeacher(r as DbRow)) : seedTeachers;
}

export async function createTeacher(data: Omit<Teacher, "id"> & { id: string }): Promise<Teacher> {
    const sql = getSql();
    const rows = await sql`
        INSERT INTO teachers (id, name, name_bn, subject, subject_bn, bio, bio_bn, image_url)
        VALUES (${data.id}, ${data.name}, ${data.nameBn}, ${data.subject}, ${data.subjectBn},
            ${data.bio}, ${data.bioBn}, ${data.imageUrl ?? null})
        RETURNING *
    `;
    return mapTeacher(rows[0] as DbRow);
}

export async function updateTeacher(id: string, data: Partial<Omit<Teacher, "id">>): Promise<Teacher> {
    const sql = getSql();
    const rows = await sql`
        UPDATE teachers SET
            name       = COALESCE(${data.name ?? null}, name),
            name_bn    = COALESCE(${data.nameBn ?? null}, name_bn),
            subject    = COALESCE(${data.subject ?? null}, subject),
            subject_bn = COALESCE(${data.subjectBn ?? null}, subject_bn),
            bio        = COALESCE(${data.bio ?? null}, bio),
            bio_bn     = COALESCE(${data.bioBn ?? null}, bio_bn),
            image_url  = COALESCE(${data.imageUrl ?? null}, image_url)
        WHERE id = ${id}
        RETURNING *
    `;
    return mapTeacher(rows[0] as DbRow);
}

export async function deleteTeacher(id: string): Promise<void> {
    const sql = getSql();
    await sql`DELETE FROM teachers WHERE id = ${id}`;
}

export async function listFaqs(): Promise<FAQ[]> {
    if (!isDbConfigured()) return seedFaqs;
    const sql = getSql();
    const rows = await sql`SELECT * FROM faqs ORDER BY sort_order, id`;
    return rows.length ? rows.map((r) => mapFaq(r as DbRow)) : seedFaqs;
}

export async function createFaq(data: Omit<FAQ, "id"> & { id: string }): Promise<FAQ> {
    const sql = getSql();
    const rows = await sql`
        INSERT INTO faqs (id, question, question_bn, answer, answer_bn, sort_order)
        VALUES (${data.id}, ${data.question}, ${data.questionBn}, ${data.answer}, ${data.answerBn}, ${data.sortOrder ?? 0})
        RETURNING *
    `;
    return mapFaq(rows[0] as DbRow);
}

export async function updateFaq(id: string, data: Partial<Omit<FAQ, "id">>): Promise<FAQ> {
    const sql = getSql();
    const rows = await sql`
        UPDATE faqs SET
            question    = COALESCE(${data.question ?? null}, question),
            question_bn = COALESCE(${data.questionBn ?? null}, question_bn),
            answer      = COALESCE(${data.answer ?? null}, answer),
            answer_bn   = COALESCE(${data.answerBn ?? null}, answer_bn),
            sort_order  = COALESCE(${data.sortOrder ?? null}, sort_order)
        WHERE id = ${id}
        RETURNING *
    `;
    return mapFaq(rows[0] as DbRow);
}

export async function deleteFaq(id: string): Promise<void> {
    const sql = getSql();
    await sql`DELETE FROM faqs WHERE id = ${id}`;
}

export async function listTestimonials(): Promise<Testimonial[]> {
    if (!isDbConfigured()) return seedTestimonials;
    const sql = getSql();
    const rows = await sql`SELECT * FROM testimonials ORDER BY id`;
    return rows.length ? rows.map((r) => mapTestimonial(r as DbRow)) : seedTestimonials;
}

export async function createTestimonial(data: Omit<Testimonial, "id"> & { id: string }): Promise<Testimonial> {
    const sql = getSql();
    const rows = await sql`
        INSERT INTO testimonials (id, quote, quote_bn, author, author_bn, role, role_bn)
        VALUES (${data.id}, ${data.quote}, ${data.quoteBn}, ${data.author}, ${data.authorBn}, ${data.role}, ${data.roleBn})
        RETURNING *
    `;
    return mapTestimonial(rows[0] as DbRow);
}

export async function updateTestimonial(id: string, data: Partial<Omit<Testimonial, "id">>): Promise<Testimonial> {
    const sql = getSql();
    const rows = await sql`
        UPDATE testimonials SET
            quote     = COALESCE(${data.quote ?? null}, quote),
            quote_bn  = COALESCE(${data.quoteBn ?? null}, quote_bn),
            author    = COALESCE(${data.author ?? null}, author),
            author_bn = COALESCE(${data.authorBn ?? null}, author_bn),
            role      = COALESCE(${data.role ?? null}, role),
            role_bn   = COALESCE(${data.roleBn ?? null}, role_bn)
        WHERE id = ${id}
        RETURNING *
    `;
    return mapTestimonial(rows[0] as DbRow);
}

export async function deleteTestimonial(id: string): Promise<void> {
    const sql = getSql();
    await sql`DELETE FROM testimonials WHERE id = ${id}`;
}

export async function listResults(): Promise<StudentResult[]> {
    if (!isDbConfigured()) return seedResults;
    const sql = getSql();
    const rows = await sql`SELECT * FROM results ORDER BY year DESC, student_name`;
    return rows.length ? rows.map((r) => mapResult(r as DbRow)) : seedResults;
}

export async function createResult(data: Omit<StudentResult, "id"> & { id: string }): Promise<StudentResult> {
    const sql = getSql();
    const rows = await sql`
        INSERT INTO results (id, student_name, student_name_bn, exam, exam_bn, subject, subject_bn, grade, grade_bn, year)
        VALUES (${data.id}, ${data.studentName}, ${data.studentNameBn}, ${data.exam}, ${data.examBn},
            ${data.subject}, ${data.subjectBn}, ${data.grade}, ${data.gradeBn}, ${data.year})
        RETURNING *
    `;
    return mapResult(rows[0] as DbRow);
}

export async function updateResult(id: string, data: Partial<Omit<StudentResult, "id">>): Promise<StudentResult> {
    const sql = getSql();
    const rows = await sql`
        UPDATE results SET
            student_name    = COALESCE(${data.studentName ?? null}, student_name),
            student_name_bn = COALESCE(${data.studentNameBn ?? null}, student_name_bn),
            exam            = COALESCE(${data.exam ?? null}, exam),
            exam_bn         = COALESCE(${data.examBn ?? null}, exam_bn),
            subject         = COALESCE(${data.subject ?? null}, subject),
            subject_bn      = COALESCE(${data.subjectBn ?? null}, subject_bn),
            grade           = COALESCE(${data.grade ?? null}, grade),
            grade_bn        = COALESCE(${data.gradeBn ?? null}, grade_bn),
            year            = COALESCE(${data.year ?? null}, year)
        WHERE id = ${id}
        RETURNING *
    `;
    return mapResult(rows[0] as DbRow);
}

export async function deleteResult(id: string): Promise<void> {
    const sql = getSql();
    await sql`DELETE FROM results WHERE id = ${id}`;
}

