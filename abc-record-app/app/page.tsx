"use client";

import {
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  BarChart3,
  BookOpenCheck,
  Camera,
  Check,
  ChevronLeft,
  ClipboardList,
  Clock3,
  CloudSun,
  FileText,
  HeartPulse,
  Home,
  LogIn,
  Mic,
  Play,
  Plus,
  Settings,
  ShieldCheck,
  Square,
  Thermometer,
  UserRound,
  Users,
  Volume2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { login, signup } from "@/lib/api/authApi";
import {
  createStudent,
  getStudent,
  getStudents,
  updateStudent,
  type StudentResponse,
} from "@/lib/api/studentApi";
import {
  endSession,
  startSession,
  type RecordSession,
} from "@/lib/api/sessionApi";

type Screen =
  | "login"
  | "home"
  | "record"
  | "abc"
  | "records"
  | "analysis"
  | "students"
  | "newStudent"
  | "recordStudent"
  | "settings";

type AuthMode = "login" | "signup";

type Student = {
  id: string;
  apiId: number;
  name: string;
  grade: string;
  birthDate: string;
  disability: string;
  support: string;
  metadata: Record<string, unknown>;
  tone: string;
};

type Behavior = "sound" | "leave" | "throw" | "cry" | "selfHarm" | "other";
type MediaAssistStatus = "idle" | "active" | "fallback" | "disabled";
type StoredMediaStatus = Exclude<MediaAssistStatus, "idle">;

type BehaviorRecord = {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  duration: number;
  antecedent: string;
  customAntecedent?: string;
  behavior: Behavior;
  customBehavior?: string;
  consequence: string;
  customConsequence?: string;
  memo: string;
  completed: boolean;
  mediaAssistEnabled?: boolean;
  mediaStatus?: StoredMediaStatus;
  detectedBehavior?: string;
  confidence?: number;
  startedAt?: string;
  endedAt?: string;
};

type DraftRecord = Pick<
  BehaviorRecord,
  | "id"
  | "studentId"
  | "studentName"
  | "date"
  | "time"
  | "duration"
  | "mediaAssistEnabled"
  | "mediaStatus"
  | "detectedBehavior"
  | "confidence"
  | "startedAt"
  | "endedAt"
>;

type PendingRecord = Pick<
  BehaviorRecord,
  | "id"
  | "date"
  | "time"
  | "duration"
  | "mediaAssistEnabled"
  | "mediaStatus"
  | "detectedBehavior"
  | "confidence"
  | "startedAt"
  | "endedAt"
>;

type WeatherInfo = {
  temperature: number | null;
  windSpeed: number | null;
  condition: string;
  location: string;
  status: "loading" | "ready" | "error";
};

const T = {
  appTitle: "\uC2E4\uC2DC\uAC04 ABC \uD589\uB3D9 \uAE30\uB85D",
  loginTitle: "\uD2B9\uC218\uAD50\uC0AC \uB85C\uADF8\uC778",
  loginSubtitle: "\uD559\uC0DD \uD589\uB3D9 \uAE30\uB85D\uC744 \uC548\uC804\uD558\uAC8C \uAD00\uB9AC\uD558\uC138\uC694.",
  home: "\uD648",
  record: "\uAE30\uB85D",
  records: "\uBAA9\uB85D",
  analysis: "\uBD84\uC11D",
  students: "\uD559\uC0DD",
  settings: "\uC124\uC815",
  todayRecords: "\uC624\uB298 \uAE30\uB85D",
  incomplete: "\uBBF8\uC644\uB8CC",
  weather: "\uB0A0\uC528",
  startNow: "\uC989\uC2DC \uAE30\uB85D \uC2DC\uC791",
  recentRecords: "\uCD5C\uADFC \uAE30\uB85D",
  viewAll: "\uC804\uCCB4 \uBCF4\uAE30",
  recordingScreen: "\uC2E4\uC2DC\uAC04 \uD589\uB3D9 \uAE30\uB85D",
  selectStudent: "\uD559\uC0DD \uC120\uD0DD",
  selectStudentHelp:
    "\uAD00\uCC30 \uB300\uC0C1 \uD559\uC0DD\uC744 \uC120\uD0DD\uD558\uACE0 \uD0C0\uC774\uBA38\uB97C \uC2DC\uC791\uD558\uC138\uC694.",
  selectStudentAfterRecording:
    "\uB179\uC74C\uD55C \uAE30\uB85D\uC744 \uC5B4\uB5A4 \uD559\uC0DD\uC5D0\uAC8C \uC5F0\uACB0\uD560\uC9C0 \uC120\uD0DD\uD558\uC138\uC694.",
  recording: "\uAE30\uB85D \uC911",
  startRecord: "\uAE30\uB85D \uC2DC\uC791",
  endBehavior: "\uD589\uB3D9 \uC885\uB8CC",
  abcInput: "ABC \uC785\uB825",
  antecedent: "A. \uC120\uD589 \uC0AC\uAC74",
  behavior: "B. \uD589\uB3D9",
  consequence: "C. \uACB0\uACFC",
  saveDraft: "\uC784\uC2DC \uC800\uC7A5",
  editDraft: "\uC218\uC815",
  completeRecord: "\uAE30\uB85D \uC644\uB8CC",
  recordList: "\uD589\uB3D9 \uAE30\uB85D \uBAA9\uB85D",
  analysisTitle: "\uBD84\uC11D \uB300\uC2DC\uBCF4\uB4DC",
  studentManage: "\uD559\uC0DD \uAD00\uB9AC",
  settingsTitle: "\uC124\uC815",
  complete: "\uC644\uB8CC",
  draft: "\uBBF8\uC644\uB8CC",
  seconds: "\uCD08",
  teacher: "\uAE40\uC120\uC0DD\uB2D8",
};

const studentsSeed: Student[] = [];

const behaviorMeta: Record<
  Behavior,
  { label: string; emoji: string; color: string }
> = {
  sound: {
    label: "\uC18C\uB9AC \uC9C0\uB984",
    emoji: "\uD83D\uDCE3",
    color: "bg-sky-100 text-sky-800",
  },
  leave: {
    label: "\uC790\uB9AC \uC774\uD0C8",
    emoji: "\uD83D\uDEB6",
    color: "bg-teal-100 text-teal-800",
  },
  throw: {
    label: "\uBB3C\uAC74 \uB358\uC9D0",
    emoji: "\uD83E\uDDF1",
    color: "bg-orange-100 text-orange-800",
  },
  cry: {
    label: "\uC6B8\uC74C",
    emoji: "\uD83D\uDCA7",
    color: "bg-indigo-100 text-indigo-800",
  },
  selfHarm: {
    label: "\uC790\uD574 \uD589\uB3D9",
    emoji: "\u26A0\uFE0F",
    color: "bg-rose-100 text-rose-800",
  },
  other: {
    label: "\uAE30\uD0C0",
    emoji: "\u270D\uFE0F",
    color: "bg-slate-100 text-slate-700",
  },
};

const antecedentOptions = [
  "\uACFC\uC81C \uC81C\uC2DC",
  "\uD65C\uB3D9 \uC804\uD658",
  "\uC18C\uC74C \uBC1C\uC0DD",
  "\uAD00\uC2EC \uBD80\uC7AC",
  "\uB610\uB798 \uAC08\uB4F1",
  "\uC6D0\uD558\uB294 \uD65C\uB3D9 \uC81C\uD55C",
  "\uAE30\uD0C0",
];

const consequenceOptions = [
  "\uC5B8\uC5B4\uC801 \uD6C8\uC721",
  "\uC9C4\uC815 \uACF5\uAC04 \uC774\uB3D9",
  "\uAC10\uAC01 \uB3C4\uAD6C \uC81C\uACF5",
  "\uAD00\uC2EC \uC81C\uACF5",
  "\uD65C\uB3D9 \uC7AC\uC548\uB0B4",
  "\uAE30\uD0C0",
];

const studentToneOptions = [
  "bg-sky-100 text-sky-800",
  "bg-teal-100 text-teal-800",
  "bg-orange-100 text-orange-800",
  "bg-indigo-100 text-indigo-800",
  "bg-rose-100 text-rose-800",
  "bg-slate-100 text-slate-700",
];

function mapStudent(student: StudentResponse, index: number): Student {
  const metadata = student.metadata ?? {};
  const disability =
    typeof metadata.disability === "string"
      ? metadata.disability.trim()
      : "";

  return {
    id: String(student.studentId),
    apiId: student.studentId,
    name: student.name.trim(),
    grade:
      typeof student.grade === "number"
        ? `\uCD08 ${student.grade}`
        : "\uBBF8\uC785\uB825",
    birthDate: student.birthDate,
    disability: disability || "\uC7A5\uC560 \uC815\uBCF4 \uBBF8\uC785\uB825",
    support: student.iepSummary?.trim() || "\uC9C0\uC6D0 \uACC4\uD68D \uBBF8\uC785\uB825",
    metadata,
    tone: studentToneOptions[index % studentToneOptions.length],
  };
}

function parseGrade(value: string) {
  const match = value.match(/\d+/);
  if (!match) return undefined;
  const grade = Number(match[0]);
  return grade >= 1 && grade <= 12 ? grade : undefined;
}

function apiMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "\uC694\uCCAD \uCC98\uB9AC \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.";
}

function sessionToPendingRecord(session: RecordSession): PendingRecord {
  const endedAt = session.endedAt ? new Date(session.endedAt) : new Date();
  const startedAt = new Date(session.startedAt);

  return {
    id: String(session.sessionId),
    date: endedAt.toISOString().slice(0, 10),
    time: endedAt.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    duration: Math.max(session.durationSeconds ?? 1, 1),
    mediaAssistEnabled: session.mediaAssisted,
    mediaStatus: session.mediaAssisted ? "active" : "disabled",
    detectedBehavior: session.mediaAssisted
      ? "\uC601\uC0C1\u00B7\uC74C\uC131 \uBCF4\uC870 \uC138\uC158"
      : "\uC218\uB3D9 \uAE30\uB85D \uC138\uC158",
    confidence: session.mediaAssisted ? 0.72 : 0,
    startedAt: Number.isNaN(startedAt.getTime())
      ? session.startedAt
      : startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
  };
}

const initialRecords: BehaviorRecord[] = [];

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

export default function Page() {
  const [screen, setScreen] = useState<Screen>("login");
  const [students, setStudents] = useState<Student[]>(studentsSeed);
  const [records, setRecords] = useState<BehaviorRecord[]>(initialRecords);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [draft, setDraft] = useState<DraftRecord | null>(null);
  const [pendingRecord, setPendingRecord] = useState<PendingRecord | null>(
    null,
  );
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [selectedA, setSelectedA] = useState("");
  const [customAntecedent, setCustomAntecedent] = useState("");
  const [selectedBehavior, setSelectedBehavior] = useState<Behavior | "">("");
  const [customBehavior, setCustomBehavior] = useState("");
  const [selectedC, setSelectedC] = useState("");
  const [customConsequence, setCustomConsequence] = useState("");
  const [memo, setMemo] = useState("");
  const [alertsOn, setAlertsOn] = useState(true);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("");
  const [newStudentBirthDate, setNewStudentBirthDate] = useState("");
  const [newStudentDisability, setNewStudentDisability] = useState("");
  const [newStudentSupport, setNewStudentSupport] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [teacherName, setTeacherName] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupSchoolName, setSignupSchoolName] = useState("");
  const [signupClassName, setSignupClassName] = useState("");
  const [className, setClassName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authNotice, setAuthNotice] = useState("");
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [studentSaving, setStudentSaving] = useState(false);
  const [studentError, setStudentError] = useState("");
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState("");
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [mediaAssistStatus, setMediaAssistStatus] =
    useState<MediaAssistStatus>("idle");
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [mediaAssistStartedAt, setMediaAssistStartedAt] = useState("");

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) ??
    students[0] ??
    null;
  const todayRecords = records.filter(
    (record) => record.date === todayString(),
  );
  const incompleteRecords = records.filter((record) => !record.completed);

  const behaviorCounts = useMemo(() => {
    return Object.keys(behaviorMeta).map((key) => {
      const behavior = key as Behavior;
      return {
        name: behaviorMeta[behavior].label,
        value: records.filter((record) => record.behavior === behavior).length,
      };
    });
  }, [records]);

  const studentChart = useMemo(() => {
    return students.map((student) => ({
      name: student.name.slice(1),
      count: records.filter((record) => record.studentId === student.id).length,
    }));
  }, [records, students]);

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(
      () => setElapsed((current) => current + 1),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mediaStream]);

  const loadStudents = useCallback(async () => {
    setStudentsLoading(true);
    setStudentsError("");

    try {
      const page = await getStudents({ page: 0, size: 20 });
      const details = await Promise.allSettled(
        page.content.map((student) => getStudent(student.studentId)),
      );
      const nextStudents = page.content.map((student, index) =>
        mapStudent(
          details[index]?.status === "fulfilled"
            ? details[index].value
            : student,
          index,
        ),
      );
      setStudents(nextStudents);
      setSelectedStudentId((current) => current || nextStudents[0]?.id || "");
    } catch (error) {
      setStudentsError(apiMessage(error));
      setStudents([]);
      setSelectedStudentId("");
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  const resetAbc = () => {
    setSelectedA("");
    setCustomAntecedent("");
    setSelectedBehavior("");
    setCustomBehavior("");
    setSelectedC("");
    setCustomConsequence("");
    setMemo("");
  };

  const handleStartRecording = async () => {
    if (students.length === 0) {
      setSessionError("학생정보를 입력해주세요.");
      return;
    }

    setSessionLoading(true);
    setSessionError("");
    setElapsed(0);
    setDraft(null);
    setPendingRecord(null);
    setEditingRecordId(null);
    setMediaAssistStatus("active");
    setMediaAssistStartedAt(new Date().toISOString());
    setActiveSessionId(null);
    setIsRecording(true);
    resetAbc();
    setScreen("record");

    let nextStream: MediaStream | null = null;
    let nextMediaStatus: MediaAssistStatus = "active";

    try {
      mediaStream?.getTracks().forEach((track) => track.stop());
      nextStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
    } catch {
      nextStream = null;
      nextMediaStatus = "fallback";
    }

    setMediaStream(nextStream);
    setMediaAssistStatus(nextMediaStatus);
    setSessionLoading(false);
  };

  const handleEndRecording = () => {
    setSessionLoading(true);
    setSessionError("");
    const now = new Date();
    mediaStream?.getTracks().forEach((track) => track.stop());
    setMediaStream(null);

    const startedAt = mediaAssistStartedAt || now.toISOString();
    setPendingRecord({
      id: `local-${now.getTime()}`,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      duration: Math.max(elapsed, 1),
      mediaAssistEnabled: mediaAssistStatus === "active",
      mediaStatus: mediaAssistStatus === "active" ? "active" : "fallback",
      detectedBehavior:
        mediaAssistStatus === "active"
          ? "영상·음성 보조 세션"
          : "텍스트 기록 모드",
      confidence: mediaAssistStatus === "active" ? 0.72 : 0,
      startedAt,
      endedAt: now.toISOString(),
    });
    setActiveSessionId(null);
    setIsRecording(false);
    setSessionLoading(false);
    setScreen("recordStudent");
  };

  const handleSelectRecordedStudent = async (studentId: string) => {
    if (!pendingRecord) return;

    const student = students.find((item) => item.id === studentId);
    if (!student) return;

    setSessionLoading(true);
    setSessionError("");

    let nextPendingRecord = pendingRecord;
    try {
      const session = await startSession(student.apiId, {
        triggerType: "MANUAL",
        mediaAssisted: pendingRecord.mediaStatus === "active",
      });
      await endSession(session.sessionId);
      nextPendingRecord = {
        ...pendingRecord,
        id: String(session.sessionId),
      };
    } catch {
      nextPendingRecord = pendingRecord;
    } finally {
      setSessionLoading(false);
    }

    setSelectedStudentId(student.id);
    setDraft({
      ...nextPendingRecord,
      studentId: student.id,
      studentName: student.name,
    });
    setPendingRecord(null);
    setScreen("abc");
  };

  const handleSaveRecord = (completed: boolean) => {
    if (
      !draft ||
      !selectedBehavior ||
      (selectedBehavior === "other" && !customBehavior.trim()) ||
      (selectedA === "\uAE30\uD0C0" && !customAntecedent.trim()) ||
      (selectedC === "\uAE30\uD0C0" && !customConsequence.trim())
    ) {
      return;
    }

    const nextRecord: BehaviorRecord = {
      ...draft,
      antecedent: selectedA,
      customAntecedent:
        selectedA === "\uAE30\uD0C0" ? customAntecedent.trim() : undefined,
      behavior: selectedBehavior,
      customBehavior:
        selectedBehavior === "other" ? customBehavior.trim() : undefined,
      consequence: selectedC,
      customConsequence:
        selectedC === "\uAE30\uD0C0" ? customConsequence.trim() : undefined,
      memo,
      completed,
    };

    setRecords((current) =>
      editingRecordId
        ? current.map((record) =>
            record.id === editingRecordId ? nextRecord : record,
          )
        : [nextRecord, ...current],
    );
    setDraft(null);
    setEditingRecordId(null);
    setElapsed(0);
    setMediaAssistStatus("idle");
    resetAbc();
    setScreen("home");
  };

  const handleEditDraft = (record: BehaviorRecord) => {
    setDraft({
      id: record.id,
      studentId: record.studentId,
      studentName: record.studentName,
      date: record.date,
      time: record.time,
      duration: record.duration,
      mediaAssistEnabled: record.mediaAssistEnabled,
      mediaStatus: record.mediaStatus,
      detectedBehavior: record.detectedBehavior,
      confidence: record.confidence,
      startedAt: record.startedAt,
      endedAt: record.endedAt,
    });
    setEditingRecordId(record.id);
    setSelectedStudentId(record.studentId);
    setSelectedA(record.antecedent);
    setCustomAntecedent(record.customAntecedent ?? "");
    setSelectedBehavior(record.behavior);
    setCustomBehavior(record.customBehavior ?? "");
    setSelectedC(record.consequence);
    setCustomConsequence(record.customConsequence ?? "");
    setMemo(record.memo);
    setIsRecording(false);
    setScreen("abc");
  };

  const handleOpenNewStudent = () => {
    setEditingStudentId(null);
    setNewStudentName("");
    setNewStudentGrade("");
    setNewStudentBirthDate("");
    setNewStudentDisability("");
    setNewStudentSupport("");
    setStudentError("");
    setScreen("newStudent");
  };

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudentId(student.id);
    setNewStudentName(student.name);
    setNewStudentGrade(student.grade === "미입력" ? "" : student.grade);
    setNewStudentBirthDate(student.birthDate);
    setNewStudentDisability(
      student.disability === "장애 정보 미입력" ? "" : student.disability,
    );
    setNewStudentSupport(
      student.support === "지원 계획 미입력" ? "" : student.support,
    );
    setStudentError("");
    setScreen("newStudent");
  };

  const handleSaveStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newStudentName.trim();
    const birthDate = newStudentBirthDate.trim();
    if (!name || !birthDate) return;

    setStudentSaving(true);
    setStudentError("");

    try {
      if (editingStudentId) {
        const targetIndex = students.findIndex(
          (student) => student.id === editingStudentId,
        );
        const targetStudent = students[targetIndex];
        if (!targetStudent) return;

        const updated = await updateStudent(targetStudent.apiId, {
          grade: parseGrade(newStudentGrade),
          iepSummary: newStudentSupport.trim() || undefined,
          metadata: {
            ...targetStudent.metadata,
            disability: newStudentDisability.trim() || null,
          },
        });
        const nextStudent = mapStudent(
          updated,
          targetIndex >= 0 ? targetIndex : students.length,
        );

        setStudents((current) =>
          current.map((student) =>
            student.id === editingStudentId
              ? { ...nextStudent, tone: student.tone }
              : student,
          ),
        );
        setSelectedStudentId(nextStudent.id);
        setEditingStudentId(null);
        setNewStudentName("");
        setNewStudentGrade("");
        setNewStudentBirthDate("");
        setNewStudentDisability("");
        setNewStudentSupport("");
        setScreen("students");
        return;
      }

      const created = await createStudent({
        name,
        birthDate,
        grade: parseGrade(newStudentGrade),
        iepSummary: newStudentSupport.trim() || undefined,
        metadata: {
          disability: newStudentDisability.trim() || null,
        },
      });
      const nextStudent = mapStudent(created, students.length);

      setStudents((current) => [...current, nextStudent]);
      setSelectedStudentId(nextStudent.id);
      setNewStudentName("");
      setNewStudentGrade("");
      setNewStudentBirthDate("");
      setNewStudentDisability("");
      setNewStudentSupport("");
      setScreen("students");
    } catch (error) {
      setStudentError(apiMessage(error));
    } finally {
      setStudentSaving(false);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!teacherName.trim() || !teacherPassword.trim()) return;

    setAuthLoading(true);
    setAuthError("");
    setAuthNotice("");

    try {
      const result = await login({
        email: teacherName.trim(),
        password: teacherPassword,
      });
      setTeacherName(result.teacher.name.trim() || result.teacher.email);
      setClassName(result.teacher.className?.trim() ?? "");
      setTeacherPassword("");
      setScreen("home");
      await loadStudents();
    } catch (error) {
      setAuthError(apiMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !teacherName.trim() ||
      !teacherPassword.trim() ||
      !signupName.trim() ||
      !signupSchoolName.trim() ||
      !signupClassName.trim()
    ) {
      return;
    }

    setAuthLoading(true);
    setAuthError("");
    setAuthNotice("");

    try {
      const signupEmail = teacherName.trim();
      const result = await signup({
        email: signupEmail,
        password: teacherPassword,
        name: signupName.trim(),
        schoolName: signupSchoolName.trim(),
        className: signupClassName.trim(),
      });
      setTeacherName(signupEmail);
      setTeacherPassword("");
      setSignupName("");
      setSignupSchoolName("");
      setSignupClassName("");
      setClassName(result.teacher.className?.trim() ?? "");
      setAuthMode("login");
      setScreen("login");
      setAuthNotice("회원가입이 완료되었습니다. 로그인해주세요.");
    } catch (error) {
      setAuthError(apiMessage(error));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthError("");
    setAuthNotice("");
    setTeacherPassword("");
  };

  const currentTitle =
    screen === "login"
      ? T.loginTitle
      : screen === "home"
      ? T.appTitle
      : screen === "record"
        ? T.recordingScreen
        : screen === "abc"
          ? T.abcInput
          : screen === "recordStudent"
            ? T.selectStudent
            : screen === "records"
              ? T.recordList
              : screen === "analysis"
                ? T.analysisTitle
                : screen === "students"
                  ? T.studentManage
                  : screen === "newStudent"
                    ? editingStudentId
                      ? "\uD559\uC0DD \uC815\uBCF4 \uC218\uC815"
                      : "\uD559\uC0DD \uC815\uBCF4 \uC785\uB825"
                    : T.settingsTitle;

  return (
    <main className="min-h-dvh bg-[#dfe9ed] text-slate-900">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#f8fbfb] shadow-2xl shadow-slate-400/30">
        {screen !== "login" && (
          <AppHeader
            title={currentTitle}
            subtitle={screen === "home" ? teacherName : className}
            showBack={screen !== "home"}
            onBack={() => {
              if (screen === "newStudent") {
                setEditingStudentId(null);
                setStudentError("");
                setScreen("students");
                return;
              }
              if (screen === "recordStudent") {
                setPendingRecord(null);
                setElapsed(0);
              }
              setScreen("home");
            }}
          />
        )}

        <div
          className={`flex-1 overflow-y-auto px-4 ${screen === "login" ? "pb-6" : "pb-24"}`}
        >
          {screen === "login" && (
            <LoginScreen
              mode={authMode}
              teacherName={teacherName}
              password={teacherPassword}
              signupName={signupName}
              signupSchoolName={signupSchoolName}
              signupClassName={signupClassName}
              classNameLabel={className}
              loading={authLoading}
              error={authError}
              notice={authNotice}
              onModeChange={handleAuthModeChange}
              onTeacherNameChange={setTeacherName}
              onPasswordChange={setTeacherPassword}
              onSignupNameChange={setSignupName}
              onSignupSchoolNameChange={setSignupSchoolName}
              onSignupClassNameChange={setSignupClassName}
              onLogin={handleLogin}
              onSignup={handleSignup}
            />
          )}
          {screen === "home" && (
            <HomeScreen
              todayCount={todayRecords.length}
              incompleteCount={incompleteRecords.length}
              records={records}
              loading={sessionLoading}
              error={sessionError || studentsError}
              onStart={handleStartRecording}
              onNavigate={setScreen}
              onEditDraft={handleEditDraft}
            />
          )}
          {screen === "record" && selectedStudent && (
            <RecordScreen
              students={students}
              selectedStudentId={selectedStudentId}
              selectedStudent={selectedStudent}
              elapsed={elapsed}
              isRecording={isRecording}
              loading={sessionLoading}
              error={sessionError}
              mediaAssistStatus={mediaAssistStatus}
              mediaStream={mediaStream}
              onSelectStudent={setSelectedStudentId}
              onStart={handleStartRecording}
              onEnd={handleEndRecording}
              onSimulateFallback={() => {
                mediaStream?.getTracks().forEach((track) => track.stop());
                setMediaStream(null);
                setMediaAssistStatus("fallback");
              }}
            />
          )}
          {screen === "recordStudent" && pendingRecord && (
            <RecordedStudentScreen
              students={students}
              duration={pendingRecord.duration}
              onSelectStudent={handleSelectRecordedStudent}
            />
          )}
          {screen === "abc" && draft && (
            <AbcInputScreen
              draft={draft}
              selectedA={selectedA}
              customAntecedent={customAntecedent}
              selectedBehavior={selectedBehavior}
              customBehavior={customBehavior}
              selectedC={selectedC}
              customConsequence={customConsequence}
              memo={memo}
              onSelectA={setSelectedA}
              onCustomAntecedent={setCustomAntecedent}
              onSelectBehavior={setSelectedBehavior}
              onCustomBehavior={setCustomBehavior}
              onSelectC={setSelectedC}
              onCustomConsequence={setCustomConsequence}
              onMemo={setMemo}
              onSave={handleSaveRecord}
            />
          )}
          {screen === "records" && (
            <RecordListScreen records={records} onEditDraft={handleEditDraft} />
          )}
          {screen === "analysis" && (
            <AnalysisScreen
              behaviorCounts={behaviorCounts}
              studentChart={studentChart}
              records={records}
            />
          )}
          {screen === "students" && (
            <StudentScreen
              students={students}
              records={records}
              loading={studentsLoading}
              error={studentsError}
              onAdd={handleOpenNewStudent}
              onSelect={handleOpenEditStudent}
              onRetry={loadStudents}
            />
          )}
          {screen === "newStudent" && (
            <NewStudentScreen
              name={newStudentName}
              grade={newStudentGrade}
              birthDate={newStudentBirthDate}
              disability={newStudentDisability}
              support={newStudentSupport}
              loading={studentSaving}
              error={studentError}
              isEditing={Boolean(editingStudentId)}
              onNameChange={setNewStudentName}
              onGradeChange={setNewStudentGrade}
              onBirthDateChange={setNewStudentBirthDate}
              onDisabilityChange={setNewStudentDisability}
              onSupportChange={setNewStudentSupport}
              onCancel={() => {
                setEditingStudentId(null);
                setStudentError("");
                setScreen("students");
              }}
              onSave={handleSaveStudent}
            />
          )}
          {screen === "settings" && (
            <SettingsScreen alertsOn={alertsOn} onAlertsChange={setAlertsOn} />
          )}
        </div>

        {screen !== "login" && <BottomTabs active={screen} onNavigate={setScreen} />}
      </div>
    </main>
  );
}

function LoginScreen({
  mode,
  teacherName,
  password,
  signupName,
  signupSchoolName,
  signupClassName,
  classNameLabel,
  loading,
  error,
  notice,
  onModeChange,
  onTeacherNameChange,
  onPasswordChange,
  onSignupNameChange,
  onSignupSchoolNameChange,
  onSignupClassNameChange,
  onLogin,
  onSignup,
}: {
  mode: AuthMode;
  teacherName: string;
  password: string;
  signupName: string;
  signupSchoolName: string;
  signupClassName: string;
  classNameLabel: string;
  loading: boolean;
  error: string;
  notice: string;
  onModeChange: (mode: AuthMode) => void;
  onTeacherNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSignupNameChange: (value: string) => void;
  onSignupSchoolNameChange: (value: string) => void;
  onSignupClassNameChange: (value: string) => void;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
  onSignup: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const isSignup = mode === "signup";

  return (
    <section className="flex min-h-dvh flex-col justify-center py-8">
      <div className="mb-8 space-y-5">
        <div className="grid size-16 place-items-center rounded-2xl bg-sky-100 text-sky-800">
          <ShieldCheck className="size-8" />
        </div>
        <div>
          <p className="text-sm font-bold text-teal-700">
            {isSignup
              ? signupClassName || "\uBC18 \uC774\uB984\uC744 \uC124\uC815\uD574\uC8FC\uC138\uC694"
              : classNameLabel || "\uBC18 \uC774\uB984 \uBBF8\uC124\uC815"}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
            {isSignup ? "\uD2B9\uC218\uAD50\uC0AC \uD68C\uC6D0\uAC00\uC785" : T.loginTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {isSignup
              ? "\uD559\uC0DD \uD589\uB3D9 \uAE30\uB85D\uC744 \uAD00\uB9AC\uD560 \uAD50\uC0AC \uACC4\uC815\uC744 \uB9CC\uB4DC\uC138\uC694."
              : T.loginSubtitle}
          </p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
        <Button
          type="button"
          variant={mode === "login" ? "default" : "ghost"}
          className={`h-11 rounded-xl font-bold ${
            mode === "login"
              ? "bg-white text-sky-800 shadow-sm hover:bg-white"
              : "text-slate-500 hover:bg-transparent"
          }`}
          onClick={() => onModeChange("login")}
        >
          {"\uB85C\uADF8\uC778"}
        </Button>
        <Button
          type="button"
          variant={mode === "signup" ? "default" : "ghost"}
          className={`h-11 rounded-xl font-bold ${
            mode === "signup"
              ? "bg-white text-sky-800 shadow-sm hover:bg-white"
              : "text-slate-500 hover:bg-transparent"
          }`}
          onClick={() => onModeChange("signup")}
        >
          {"\uD68C\uC6D0\uAC00\uC785"}
        </Button>
      </div>

      <form className="space-y-4" onSubmit={isSignup ? onSignup : onLogin}>
        <Card className="rounded-2xl border-0 bg-white shadow-sm">
          <CardContent className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-name">{"\uC774\uBA54\uC77C"}</Label>
              <Input
                id="teacher-name"
                type="email"
                value={teacherName}
                onChange={(event) => onTeacherNameChange(event.target.value)}
                placeholder="teacher@school.kr"
                className="h-12 rounded-2xl bg-slate-50"
                autoFocus
                required
              />
            </div>

            {isSignup && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="signup-name">{"\uC774\uB984"}</Label>
                  <Input
                    id="signup-name"
                    value={signupName}
                    onChange={(event) =>
                      onSignupNameChange(event.target.value)
                    }
                    placeholder={"\uC608: \uAE40\uBBFC\uB098"}
                    className="h-12 rounded-2xl bg-slate-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-school">{"\uD559\uAD50\uBA85"}</Label>
                  <Input
                    id="signup-school"
                    value={signupSchoolName}
                    onChange={(event) =>
                      onSignupSchoolNameChange(event.target.value)
                    }
                    placeholder={"\uC608: \uD55C\uBE5B\uD2B9\uC218\uD559\uAD50"}
                    className="h-12 rounded-2xl bg-slate-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-class">{"\uBC18 \uC774\uB984"}</Label>
                  <Input
                    id="signup-class"
                    value={signupClassName}
                    onChange={(event) =>
                      onSignupClassNameChange(event.target.value)
                    }
                    placeholder={"\uC608: \uD589\uBCF5\uBC18"}
                    className="h-12 rounded-2xl bg-slate-50"
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="teacher-password">{"\uBE44\uBC00\uBC88\uD638"}</Label>
              <Input
                id="teacher-password"
                type="password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                placeholder={"\uBE44\uBC00\uBC88\uD638 \uC785\uB825"}
                className="h-12 rounded-2xl bg-slate-50"
                required
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-2xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700">
            {notice}
          </p>
        )}

        <Button
          type="submit"
          className="h-14 w-full rounded-2xl bg-sky-700 text-base font-bold text-white shadow-lg shadow-sky-100 hover:bg-sky-800"
          disabled={
            loading ||
            !teacherName.trim() ||
            !password.trim() ||
            (isSignup &&
              (!signupName.trim() ||
                !signupSchoolName.trim() ||
                !signupClassName.trim()))
          }
        >
          <LogIn className="mr-2 size-5" />
          {loading
            ? isSignup
              ? "\uAC00\uC785 \uC911"
              : "\uB85C\uADF8\uC778 \uC911"
            : isSignup
              ? "\uD68C\uC6D0\uAC00\uC785"
              : "\uB85C\uADF8\uC778"}
        </Button>
      </form>
    </section>
  );
}

function AppHeader({
  title,
  subtitle,
  showBack,
  onBack,
}: {
  title: string;
  subtitle: string;
  showBack: boolean;
  onBack: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/70 bg-[#f8fbfb]/90 px-4 pb-3 pt-4 backdrop-blur">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 rounded-2xl"
            onClick={onBack}
          >
            <ChevronLeft className="size-5" />
          </Button>
        )}
        <div className="min-w-0 flex-1">
          {subtitle && (
            <p className="text-xs font-semibold text-teal-700">{subtitle}</p>
          )}
          <h1 className="truncate text-xl font-bold tracking-normal text-slate-950">
            {title}
          </h1>
        </div>
        <div className="grid size-10 place-items-center rounded-2xl bg-sky-100 text-sky-800">
          <HeartPulse className="size-5" />
        </div>
      </div>
    </header>
  );
}

function HomeScreen({
  todayCount,
  incompleteCount,
  records,
  loading,
  error,
  onStart,
  onNavigate,
  onEditDraft,
}: {
  todayCount: number;
  incompleteCount: number;
  records: BehaviorRecord[];
  loading: boolean;
  error: string;
  onStart: () => void;
  onNavigate: (screen: Screen) => void;
  onEditDraft: (record: BehaviorRecord) => void;
}) {
  const [weather, setWeather] = useState<WeatherInfo>({
    temperature: null,
    windSpeed: null,
    condition: "\uBD88\uB7EC\uC624\uB294 \uC911",
    location: "\uD604\uC7AC \uC704\uCE58",
    status: "loading",
  });
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;

    const conditionLabel = (code: number) => {
      if (code === 0) return "\uB9D1\uC74C";
      if ([1, 2, 3].includes(code)) return "\uAD6C\uB984";
      if ([45, 48].includes(code)) return "\uC548\uAC1C";
      if ([51, 53, 55, 56, 57].includes(code)) return "\uC774\uC2AC\uBE44";
      if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return "\uBE44";
      }
      if ([71, 73, 75, 77, 85, 86].includes(code)) return "\uB208";
      if ([95, 96, 99].includes(code)) return "\uB1CC\uC6B0";
      return "\uB0A0\uC528";
    };

    const loadWeather = async (
      latitude: number,
      longitude: number,
      location: string,
    ) => {
      try {
        const params = new URLSearchParams({
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          current: "temperature_2m,weather_code,wind_speed_10m",
          timezone: "Asia/Seoul",
        });
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
        );
        if (!response.ok) throw new Error("weather request failed");
        const data = await response.json();
        if (!active) return;
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          condition: conditionLabel(data.current.weather_code),
          location,
          status: "ready",
        });
      } catch {
        if (!active) return;
        setWeather({
          temperature: null,
          windSpeed: null,
          condition: "\uD655\uC778 \uBD88\uAC00",
          location: "\uB0A0\uC528",
          status: "error",
        });
      }
    };

    const loadDefaultWeather = () => loadWeather(36.3504, 127.3845, "\uB300\uC804");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          loadWeather(
            position.coords.latitude,
            position.coords.longitude,
            "\uD604\uC7AC \uC704\uCE58",
          ),
        loadDefaultWeather,
        { timeout: 3000 },
      );
    } else {
      loadDefaultWeather();
    }

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="space-y-4 pt-4">
      <div className="grid grid-cols-[1fr_1.25fr] gap-3">
        <RecordSummaryCard
          todayCount={todayCount}
          incompleteCount={incompleteCount}
        />
        <WeatherMetricCard weather={weather} currentTime={currentTime} />
      </div>

      <Button
        type="button"
        onClick={onStart}
        className="h-16 w-full rounded-2xl bg-sky-700 text-base font-bold text-white shadow-lg shadow-sky-100 hover:bg-sky-800"
        disabled={loading}
      >
        <Play className="mr-2 size-5 fill-white" />
        {loading ? "\uCC98\uB9AC \uC911" : T.startNow}
      </Button>

      {error && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}

      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-base">{T.recentRecords}</CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 rounded-xl text-teal-700"
            onClick={() => onNavigate("records")}
          >
            {T.viewAll}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {records.length === 0 && (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-center text-sm font-semibold text-slate-500">
              {"\uC544\uC9C1 \uC791\uC131\uB41C ABC \uAE30\uB85D\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}
            </p>
          )}
          {records.slice(0, 3).map((record) => (
            <RecordRow
              key={record.id}
              record={record}
              compact
              onEditDraft={onEditDraft}
            />
          ))}
        </CardContent>
      </Card>

    </section>
  );
}

function RecordScreen({
  students,
  selectedStudentId,
  selectedStudent,
  elapsed,
  isRecording,
  loading,
  error,
  mediaAssistStatus,
  mediaStream,
  onSelectStudent,
  onStart,
  onEnd,
  onSimulateFallback,
}: {
  students: Student[];
  selectedStudentId: string;
  selectedStudent: Student;
  elapsed: number;
  isRecording: boolean;
  loading: boolean;
  error: string;
  mediaAssistStatus: MediaAssistStatus;
  mediaStream: MediaStream | null;
  onSelectStudent: (id: string) => void;
  onStart: () => void;
  onEnd: () => void;
  onSimulateFallback: () => void;
}) {
  return (
    <section className="space-y-4 pt-4">
      {!isRecording && (
        <Card className="rounded-2xl border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{T.selectStudent}</CardTitle>
            <p className="text-sm text-slate-500">{T.selectStudentHelp}</p>
            <p className="text-sm font-semibold text-sky-700">
              {"\uAE30\uB85D \uC2DC\uC791 \uC2DC \uC601\uC0C1\u00B7\uC74C\uC131 \uBCF4\uC870\uAC00 \uD65C\uC131\uD654\uB429\uB2C8\uB2E4."}
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            {students.map((student) => (
              <button
                type="button"
                key={student.id}
                onClick={() => onSelectStudent(student.id)}
                className={`flex items-center justify-between rounded-2xl border p-4 text-left shadow-sm transition ${
                  selectedStudentId === student.id
                    ? "border-sky-700 bg-sky-50"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-11 place-items-center rounded-2xl text-sm font-bold ${student.tone}`}
                  >
                    {student.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-bold">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.grade}</p>
                  </div>
                </div>
                {selectedStudentId === student.id && (
                  <Badge className="rounded-full bg-teal-100 text-teal-800 hover:bg-teal-100">
                    {"\uC120\uD0DD"}
                  </Badge>
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border-0 bg-gradient-to-br from-sky-700 to-teal-700 text-white shadow-lg shadow-sky-100">
        <CardContent className="space-y-5 p-6 text-center">
          <div className="mx-auto grid size-20 place-items-center rounded-full bg-white/15">
            {isRecording ? (
              <Mic className="size-9 animate-pulse" />
            ) : (
              <UserRound className="size-9" />
            )}
          </div>
          {isRecording && (
            <MediaAssistPreview
              status={mediaAssistStatus}
              stream={mediaStream}
              onSimulateFallback={onSimulateFallback}
            />
          )}
          <div>
            <p className="mt-1 text-3xl font-black">
              {isRecording
                ? T.recording
                : selectedStudent.name}
            </p>
            {!isRecording && (
              <div className="mt-1 space-y-1 text-sm text-sky-100">
                <p>{selectedStudent.disability}</p>
                <p>{selectedStudent.support}</p>
              </div>
            )}
          </div>
          <p className="text-6xl font-black tabular-nums">
            {formatDuration(elapsed)}
          </p>
          {!isRecording ? (
            <Button
              type="button"
              className="h-14 w-full rounded-2xl bg-white font-bold text-sky-800 hover:bg-sky-50"
              onClick={onStart}
              disabled={loading}
            >
              <Play className="mr-2 size-5 fill-sky-800" />
              {loading ? "\uC138\uC158 \uC2DC\uC791 \uC911" : T.startRecord}
            </Button>
          ) : (
            <Button
              type="button"
              className="h-14 w-full rounded-2xl bg-orange-400 font-bold text-white hover:bg-orange-500"
              onClick={onEnd}
              disabled={loading}
            >
              <Square className="mr-2 size-5 fill-white" />
              {loading ? "\uC138\uC158 \uC885\uB8CC \uC911" : T.endBehavior}
            </Button>
          )}
          {error && (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function MediaAssistPreview({
  status,
  stream,
  onSimulateFallback,
}: {
  status: MediaAssistStatus;
  stream: MediaStream | null;
  onSimulateFallback: () => void;
}) {
  const isFallback = status === "fallback";
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="space-y-3 text-left">
      <div className="relative overflow-hidden rounded-2xl bg-slate-950/50 shadow-inner">
        {!isFallback && stream ? (
          <video
            ref={videoRef}
            title="실시간 카메라 미리보기"
            aria-label="실시간 카메라와 마이크 보조 분석 미리보기"
            autoPlay
            muted
            playsInline
            className="aspect-video w-full object-cover opacity-90"
          />
        ) : (
          <div className="grid aspect-video w-full place-items-center bg-slate-700 text-center text-white">
            <div className="space-y-2 px-5">
              <Camera className="mx-auto size-10 text-slate-200" />
              <p className="text-sm font-black">
                {"\uBBF8\uB514\uC5B4 \uC2A4\uD2B8\uB9BC \uBBF8\uC5F0\uACB0"}
              </p>
            </div>
          </div>
        )}

      </div>

      <Button
        type="button"
        variant="secondary"
        className="h-10 w-full rounded-2xl bg-white/90 text-sm font-bold text-sky-800 hover:bg-white"
        onClick={onSimulateFallback}
      >
        {"\uC74C\uC131\uB9CC \uAE30\uB85D"}
      </Button>
    </div>
  );
}

function AbcInputScreen({
  draft,
  selectedA,
  customAntecedent,
  selectedBehavior,
  customBehavior,
  selectedC,
  customConsequence,
  memo,
  onSelectA,
  onCustomAntecedent,
  onSelectBehavior,
  onCustomBehavior,
  onSelectC,
  onCustomConsequence,
  onMemo,
  onSave,
}: {
  draft: DraftRecord;
  selectedA: string;
  customAntecedent: string;
  selectedBehavior: Behavior | "";
  customBehavior: string;
  selectedC: string;
  customConsequence: string;
  memo: string;
  onSelectA: (value: string) => void;
  onCustomAntecedent: (value: string) => void;
  onSelectBehavior: (value: Behavior) => void;
  onCustomBehavior: (value: string) => void;
  onSelectC: (value: string) => void;
  onCustomConsequence: (value: string) => void;
  onMemo: (value: string) => void;
  onSave: (completed: boolean) => void;
}) {
  const hasAntecedent = Boolean(
    selectedA &&
      (selectedA !== "\uAE30\uD0C0" || customAntecedent.trim()),
  );
  const hasBehavior = Boolean(
    selectedBehavior &&
      (selectedBehavior !== "other" || customBehavior.trim()),
  );
  const hasConsequence = Boolean(
    selectedC &&
      (selectedC !== "\uAE30\uD0C0" || customConsequence.trim()),
  );
  const ready = Boolean(hasAntecedent && hasBehavior && hasConsequence);

  return (
    <section className="space-y-4 pt-4">
      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{draft.time}</p>
              <p className="text-xl font-black">{draft.studentName}</p>
            </div>
            <Badge className="rounded-full bg-orange-100 text-orange-800 hover:bg-orange-100">
              {formatDuration(draft.duration)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <ChipGroup
        title={T.antecedent}
        options={antecedentOptions}
        selected={selectedA}
        onSelect={onSelectA}
        customValue={customAntecedent}
        onCustomValue={onCustomAntecedent}
        customPlaceholder={"\uC120\uD589\uC0AC\uAC74\uC744 \uC785\uB825\uD558\uC138\uC694."}
      />
      <BehaviorChipGroup
        selected={selectedBehavior}
        onSelect={onSelectBehavior}
        customBehavior={customBehavior}
        onCustomBehavior={onCustomBehavior}
      />
      <ChipGroup
        title={T.consequence}
        options={consequenceOptions}
        selected={selectedC}
        onSelect={onSelectC}
        customValue={customConsequence}
        onCustomValue={onCustomConsequence}
        customPlaceholder={"\uACB0\uACFC\uB97C \uC785\uB825\uD558\uC138\uC694."}
      />

      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{"\uBA54\uBAA8"}</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={memo}
            onChange={(event) => onMemo(event.target.value)}
            placeholder={
              "\uAD00\uCC30 \uB0B4\uC6A9\uC744 \uC9E7\uAC8C \uB0A8\uAE30\uC138\uC694."
            }
            className="min-h-24 w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm outline-none focus:border-sky-300"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-14 rounded-2xl bg-white font-bold"
          disabled={!hasBehavior}
          onClick={() => onSave(false)}
        >
          {T.saveDraft}
        </Button>
        <Button
          type="button"
          className="h-14 rounded-2xl bg-teal-700 font-bold hover:bg-teal-800"
          disabled={!ready}
          onClick={() => onSave(true)}
        >
          <Check className="mr-2 size-5" />
          {T.completeRecord}
        </Button>
      </div>
    </section>
  );
}

function RecordedStudentScreen({
  students,
  duration,
  onSelectStudent,
}: {
  students: Student[];
  duration: number;
  onSelectStudent: (id: string) => void;
}) {
  return (
    <section className="space-y-4 pt-4">
      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{T.selectStudent}</CardTitle>
          <p className="text-sm text-slate-500">
            {T.selectStudentAfterRecording}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl bg-sky-50 p-4 text-center">
            <p className="text-sm font-bold text-sky-800">
              {"\uB179\uC74C \uC2DC\uAC04"}
            </p>
            <p className="mt-1 text-4xl font-black tabular-nums text-slate-900">
              {formatDuration(duration)}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {students.map((student) => (
              <button
                type="button"
                key={student.id}
                onClick={() => onSelectStudent(student.id)}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-sm transition hover:border-sky-700 hover:bg-sky-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-11 place-items-center rounded-2xl text-sm font-bold ${student.tone}`}
                  >
                    {student.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="font-bold">{student.name}</p>
                    <p className="text-sm text-slate-500">{student.grade}</p>
                  </div>
                </div>
                <Badge className="rounded-full bg-sky-100 text-sky-800 hover:bg-sky-100">
                  {"\uC120\uD0DD"}
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function RecordListScreen({
  records,
  onEditDraft,
}: {
  records: BehaviorRecord[];
  onEditDraft: (record: BehaviorRecord) => void;
}) {
  return (
    <section className="space-y-3 pt-4">
      {records.map((record) => (
        <RecordRow key={record.id} record={record} onEditDraft={onEditDraft} />
      ))}
    </section>
  );
}

function AnalysisScreen({
  behaviorCounts,
  studentChart,
  records,
}: {
  behaviorCounts: Array<{ name: string; value: number }>;
  studentChart: Array<{ name: string; count: number }>;
  records: BehaviorRecord[];
}) {
  const completionRate = Math.round(
    (records.filter((record) => record.completed).length /
      Math.max(records.length, 1)) *
      100,
  );
  const pieColors = ["#0369a1", "#0f766e", "#f59e0b", "#6366f1", "#e11d48"];

  return (
    <section className="space-y-4 pt-4">
      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                {"\uAE30\uB85D \uC644\uC131\uB960"}
              </p>
              <p className="text-3xl font-black">{completionRate}%</p>
            </div>
            <BookOpenCheck className="size-10 text-teal-700" />
          </div>
          <Progress value={completionRate} className="h-3" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {"\uD589\uB3D9 \uC720\uD615 \uBD84\uD3EC"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={behaviorCounts}
                dataKey="value"
                nameKey="name"
                innerRadius={48}
                outerRadius={78}
                paddingAngle={3}
              >
                {behaviorCounts.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {"\uD559\uC0DD\uBCC4 \uAE30\uB85D \uC218"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studentChart}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
}

function StudentScreen({
  students,
  records,
  loading,
  error,
  onAdd,
  onSelect,
  onRetry,
}: {
  students: Student[];
  records: BehaviorRecord[];
  loading: boolean;
  error: string;
  onAdd: () => void;
  onSelect: (student: Student) => void;
  onRetry: () => void;
}) {
  return (
    <section className="space-y-4 pt-4">
      <Button
        type="button"
        className="h-13 w-full rounded-2xl bg-orange-400 font-bold text-white hover:bg-orange-500"
        onClick={onAdd}
      >
        <Plus className="mr-2 size-5" />
        {"\uD559\uC0DD \uCD94\uAC00"}
      </Button>
      {loading && (
        <p className="rounded-2xl bg-sky-50 px-4 py-5 text-center text-sm font-semibold text-sky-700">
          {"\uD559\uC0DD \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\uC785\uB2C8\uB2E4."}
        </p>
      )}
      {error && (
        <div className="space-y-3 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          <p>{error}</p>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-2xl bg-white"
            onClick={onRetry}
          >
            {"\uB2E4\uC2DC \uC2DC\uB3C4"}
          </Button>
        </div>
      )}
      {!loading && !error && students.length === 0 && (
        <p className="rounded-2xl bg-slate-50 px-4 py-5 text-center text-sm font-semibold text-slate-500">
          {"\uB4F1\uB85D\uB41C \uD559\uC0DD\uC774 \uC5C6\uC2B5\uB2C8\uB2E4."}
        </p>
      )}
      {students.map((student) => {
        const count = records.filter(
          (record) => record.studentId === student.id,
        ).length;
        return (
          <button
            type="button"
            key={student.id}
            className="w-full rounded-2xl bg-white text-left shadow-sm transition hover:bg-sky-50"
            onClick={() => onSelect(student)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className={`grid size-14 place-items-center rounded-2xl text-lg font-black ${student.tone}`}
              >
                {student.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black">{student.name}</p>
                <p className="text-sm text-slate-500">
                  {student.grade} · {student.disability}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {student.support}
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {count}
                {"\uAC74"}
              </Badge>
            </CardContent>
          </button>
        );
      })}
    </section>
  );
}

function NewStudentScreen({
  name,
  grade,
  birthDate,
  disability,
  support,
  loading,
  error,
  isEditing,
  onNameChange,
  onGradeChange,
  onBirthDateChange,
  onDisabilityChange,
  onSupportChange,
  onCancel,
  onSave,
}: {
  name: string;
  grade: string;
  birthDate: string;
  disability: string;
  support: string;
  loading: boolean;
  error: string;
  isEditing: boolean;
  onNameChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onBirthDateChange: (value: string) => void;
  onDisabilityChange: (value: string) => void;
  onSupportChange: (value: string) => void;
  onCancel: () => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="space-y-4 pt-4" onSubmit={onSave}>
      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {"\uD559\uC0DD \uC815\uBCF4"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student-name">{"\uD559\uC0DD\uBA85"}</Label>
            <Input
              id="student-name"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={"\uC608: \uD64D\uAE38\uB3D9"}
              className="h-12 rounded-2xl bg-slate-50"
              autoFocus
              required
              disabled={isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-grade">{"\uD559\uB144"}</Label>
            <Input
              id="student-grade"
              value={grade}
              onChange={(event) => onGradeChange(event.target.value)}
              placeholder={"\uC608: \uCD08 3"}
              className="h-12 rounded-2xl bg-slate-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-birth-date">{"\uC0DD\uB144\uC6D4\uC77C"}</Label>
            <Input
              id="student-birth-date"
              type="date"
              value={birthDate}
              onChange={(event) => onBirthDateChange(event.target.value)}
              className="h-12 rounded-2xl bg-slate-50"
              required
              disabled={isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-disability">{"\uC7A5\uC560 \uC815\uBCF4"}</Label>
            <Input
              id="student-disability"
              value={disability}
              onChange={(event) => onDisabilityChange(event.target.value)}
              placeholder={"\uC608: \uC790\uD3D0\uC131 \uC7A5\uC560"}
              className="h-12 rounded-2xl bg-slate-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-support">
              {"\uC9C0\uC6D0 \uBA54\uBAA8"}
            </Label>
            <Textarea
              id="student-support"
              value={support}
              onChange={(event) => onSupportChange(event.target.value)}
              placeholder={
                "\uC608: \uC804\uD658 \uC0C1\uD669 \uC0AC\uC804 \uC608\uACE0"
              }
              className="min-h-28 rounded-2xl bg-slate-50"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-2xl font-bold"
          onClick={onCancel}
          disabled={loading}
        >
          {"\uCDE8\uC18C"}
        </Button>
        <Button
          type="submit"
          className="h-12 rounded-2xl bg-orange-400 font-bold text-white hover:bg-orange-500"
          disabled={loading || !name.trim() || !birthDate.trim()}
        >
          <Check className="mr-2 size-5" />
          {loading
            ? "\uC800\uC7A5 \uC911"
            : isEditing
              ? "\uC218\uC815"
              : "\uC800\uC7A5"}
        </Button>
      </div>
    </form>
  );
}

function SettingsScreen({
  alertsOn,
  onAlertsChange,
}: {
  alertsOn: boolean;
  onAlertsChange: (checked: boolean) => void;
}) {
  return (
    <section className="space-y-4 pt-4">
      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-sky-100 text-sky-800">
              <Volume2 className="size-5" />
            </div>
            <div>
              <p className="font-bold">
                {"\uD070 \uC18C\uC74C \uC54C\uB9BC"}
              </p>
              <p className="text-sm text-slate-500">
                {
                  "\uD070 \uC18C\uC74C\uC774 \uC0DD\uAE30\uBA74 \uC54C\uB9BC\uC744 \uBC1B\uACA0\uC2B5\uB2C8\uAE4C?"
                }
              </p>
            </div>
          </div>
          <Switch checked={alertsOn} onCheckedChange={onAlertsChange} />
        </CardContent>
      </Card>
    </section>
  );
}

function ChipGroup({
  title,
  options,
  selected,
  onSelect,
  customValue,
  onCustomValue,
  customPlaceholder,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  customValue?: string;
  onCustomValue?: (value: string) => void;
  customPlaceholder?: string;
}) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Button
              type="button"
              key={option}
              variant={selected === option ? "default" : "secondary"}
              className={`h-10 rounded-full px-4 ${selected === option ? "bg-sky-700 hover:bg-sky-800" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              onClick={() => onSelect(option)}
            >
              {option}
            </Button>
          ))}
        </div>
        {selected === "\uAE30\uD0C0" && onCustomValue && (
          <Input
            value={customValue ?? ""}
            onChange={(event) => onCustomValue(event.target.value)}
            placeholder={customPlaceholder}
            className="h-12 rounded-2xl bg-slate-50"
            autoFocus
          />
        )}
      </CardContent>
    </Card>
  );
}

function BehaviorChipGroup({
  selected,
  onSelect,
  customBehavior,
  onCustomBehavior,
}: {
  selected: Behavior | "";
  onSelect: (value: Behavior) => void;
  customBehavior: string;
  onCustomBehavior: (value: string) => void;
}) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{T.behavior}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(behaviorMeta) as Behavior[]).map((key) => {
            const item = behaviorMeta[key];
            return (
              <button
                type="button"
                key={key}
                onClick={() => onSelect(key)}
                className={`rounded-2xl border p-3 text-left shadow-sm ${selected === key ? "border-sky-700 bg-sky-50" : "border-slate-100 bg-white"}`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="mt-2 block text-sm font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
        {selected === "other" && (
          <div className="space-y-2">
            <Label htmlFor="custom-behavior">
              {"\uD589\uB3D9 \uB0B4\uC6A9"}
            </Label>
            <Input
              id="custom-behavior"
              value={customBehavior}
              onChange={(event) => onCustomBehavior(event.target.value)}
              placeholder={"\uAD00\uCC30\uD55C \uD589\uB3D9\uC744 \uC785\uB825\uD558\uC138\uC694."}
              className="h-12 rounded-2xl bg-slate-50"
              autoFocus
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecordRow({
  record,
  compact = false,
  onEditDraft,
}: {
  record: BehaviorRecord;
  compact?: boolean;
  onEditDraft?: (record: BehaviorRecord) => void;
}) {
  const meta = behaviorMeta[record.behavior];
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm">
      <CardContent
        className={`${compact ? "p-3" : "p-4"} flex items-start gap-3`}
      >
        <div
          className={`grid size-11 shrink-0 place-items-center rounded-2xl text-xl ${meta.color}`}
        >
          {meta.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-black">{record.studentName}</p>
            <div className="flex shrink-0 items-center gap-2">
              {!record.completed && onEditDraft && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-full px-2 text-xs text-sky-700"
                  onClick={() => onEditDraft(record)}
                >
                  {T.editDraft}
                </Button>
              )}
              <Badge
                className={`rounded-full ${record.completed ? "bg-teal-100 text-teal-800 hover:bg-teal-100" : "bg-orange-100 text-orange-800 hover:bg-orange-100"}`}
              >
                {record.completed ? T.complete : T.draft}
              </Badge>
            </div>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            {record.customBehavior || meta.label}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {record.time} · {formatDuration(record.duration)} ·{" "}
            {record.customAntecedent || record.antecedent || "-"}
          </p>
          {!compact && (
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">
              {record.memo || "\uBA54\uBAA8 \uC5C6\uC74C"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function RecordSummaryCard({
  todayCount,
  incompleteCount,
}: {
  todayCount: number;
  incompleteCount: number;
}) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm">
      <CardContent className="flex h-full flex-col justify-between p-4">
        <div className="grid size-10 place-items-center rounded-2xl bg-sky-100 text-sky-800">
          <ClipboardList className="size-5" />
        </div>
        <div className="mt-5 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              {T.todayRecords}
            </p>
            <p className="mt-1 text-3xl font-black tabular-nums">
              {todayCount}
            </p>
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-orange-50 px-3 py-2 text-orange-800">
            <span className="flex items-center gap-1.5 text-xs font-bold">
              <Clock3 className="size-3.5" />
              {T.incomplete}
            </span>
            <span className="text-lg font-black tabular-nums">
              {incompleteCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WeatherMetricCard({
  weather,
  currentTime,
}: {
  weather: WeatherInfo;
  currentTime: Date;
}) {
  const temperature =
    weather.temperature === null ? "--" : `${weather.temperature}\u00B0`;
  const timeText = currentTime.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const wind =
    weather.status === "ready" && weather.windSpeed !== null
      ? `\uBC14\uB78C ${weather.windSpeed}km/h`
      : weather.status === "loading"
        ? "\uC704\uCE58 \uD655\uC778 \uC911"
        : "\uB0A0\uC528 \uD655\uC778 \uBD88\uAC00";

  return (
    <Card className="overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-700 text-white shadow-lg shadow-sky-200">
      <CardContent className="relative min-h-[150px] p-4">
        <div className="absolute right-3 top-3 text-white/80">
          {weather.status === "loading" ? (
            <Thermometer className="size-9 animate-pulse" />
          ) : (
            <CloudSun className="size-10" />
          )}
        </div>
        <div className="relative flex h-full min-h-[118px] flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pr-10">
              <p className="truncate text-sm font-bold text-white/80">
                {weather.location}
              </p>
              <p className="shrink-0 text-xs font-bold tabular-nums text-white/75">
                {timeText}
              </p>
            </div>
            <p className="mt-1 text-sm font-semibold text-white/90">
              {weather.condition}
            </p>
          </div>
          <div>
            <p className="text-5xl font-black leading-none tracking-normal">
              {temperature}
            </p>
            <p className="mt-2 text-xs font-semibold text-white/80">{wind}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLink({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-white p-4 text-left font-bold shadow-sm"
    >
      <span className="grid size-10 place-items-center rounded-2xl bg-teal-100 text-teal-800">
        {icon}
      </span>
      {label}
    </button>
  );
}

function BottomTabs({
  active,
  onNavigate,
}: {
  active: Screen;
  onNavigate: (screen: Screen) => void;
}) {
  const items = [
    { id: "home" as Screen, label: T.home, icon: Home },
    { id: "records" as Screen, label: T.records, icon: FileText },
    { id: "analysis" as Screen, label: T.analysis, icon: BarChart3 },
    { id: "students" as Screen, label: T.students, icon: Users },
    { id: "settings" as Screen, label: T.settings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="grid h-20 grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const selected =
            active === item.id || (item.id === "record" && active === "abc");
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 text-[11px] font-bold ${selected ? "text-sky-800" : "text-slate-400"}`}
            >
              <span
                className={`grid size-9 place-items-center rounded-2xl ${selected ? "bg-sky-100" : "bg-transparent"}`}
              >
                <Icon className="size-5" />
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
