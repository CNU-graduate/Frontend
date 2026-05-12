"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpenCheck,
  Check,
  ChevronLeft,
  ClipboardList,
  Clock3,
  FileText,
  HeartPulse,
  Home,
  LogIn,
  Mic,
  Play,
  Plus,
  ShieldCheck,
  Settings,
  Square,
  UserRound,
  Users,
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

type Student = {
  id: string;
  name: string;
  grade: string;
  support: string;
  tone: string;
};

type Behavior = "sound" | "leave" | "throw" | "cry" | "selfHarm";

type BehaviorRecord = {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  duration: number;
  antecedent: string;
  behavior: Behavior;
  consequence: string;
  memo: string;
  completed: boolean;
};

type DraftRecord = Pick<
  BehaviorRecord,
  "id" | "studentId" | "studentName" | "date" | "time" | "duration"
>;

type PendingRecord = Pick<BehaviorRecord, "id" | "date" | "time" | "duration">;

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
  riskWatch: "\uC8FC\uC758 \uAD00\uCC30",
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
  className: "\uB3C4\uC6C0\uBC18",
};

const studentsSeed: Student[] = [
  {
    id: "stu-1",
    name: "\uAE40\uBBFC\uC900",
    grade: "\uCD08 3",
    support: "\uC804\uD658 \uC0C1\uD669 \uC0AC\uC804 \uC608\uACE0",
    tone: "bg-sky-100 text-sky-800",
  },
  {
    id: "stu-2",
    name: "\uC774\uC11C\uC5F0",
    grade: "\uCD08 4",
    support: "\uC18C\uC74C \uC790\uADF9 \uC644\uD654",
    tone: "bg-mint-100 text-teal-800",
  },
  {
    id: "stu-3",
    name: "\uBC15\uB3C4\uC724",
    grade: "\uCD08 5",
    support: "\uAC10\uC815 \uD45C\uD604 \uB300\uCCB4 \uC804\uB7B5",
    tone: "bg-orange-100 text-orange-800",
  },
];

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
    label: "\uC790\uD574 \uC2DC\uB3C4",
    emoji: "\u26A0\uFE0F",
    color: "bg-rose-100 text-rose-800",
  },
};

const antecedentOptions = [
  "\uACFC\uC81C \uC81C\uC2DC",
  "\uD65C\uB3D9 \uC804\uD658",
  "\uC18C\uC74C \uBC1C\uC0DD",
  "\uB300\uAE30 \uC2DC\uAC04",
  "\uB610\uB798 \uAC08\uB4F1",
  "\uC9C0\uC2DC \uC774\uD574 \uC5B4\uB824\uC6C0",
];

const consequenceOptions = [
  "\uC5B8\uC5B4\uC801 \uC548\uB0B4",
  "\uC9C4\uC815 \uACF5\uAC04 \uC774\uB3D9",
  "\uAC10\uAC01 \uB3C4\uAD6C \uC81C\uACF5",
  "\uD734\uC2DD",
  "\uD65C\uB3D9 \uC7AC\uC548\uB0B4",
  "\uBCF4\uD638\uC790 \uACF5\uC720 \uD544\uC694",
];

const studentToneOptions = [
  "bg-sky-100 text-sky-800",
  "bg-teal-100 text-teal-800",
  "bg-orange-100 text-orange-800",
  "bg-indigo-100 text-indigo-800",
  "bg-rose-100 text-rose-800",
  "bg-slate-100 text-slate-700",
];

const initialRecords: BehaviorRecord[] = [
  {
    id: "rec-1",
    studentId: "stu-1",
    studentName: "\uAE40\uBBFC\uC900",
    date: "2026-05-12",
    time: "09:35",
    duration: 48,
    antecedent: "\uD65C\uB3D9 \uC804\uD658",
    behavior: "leave",
    consequence: "\uD65C\uB3D9 \uC7AC\uC548\uB0B4",
    memo: "\uC2DC\uAC01 \uC2A4\uCF00\uC904\uB85C \uB2E4\uC74C \uD65C\uB3D9\uC744 \uC548\uB0B4\uD558\uC790 \uBCF5\uADC0\uD568.",
    completed: true,
  },
  {
    id: "rec-2",
    studentId: "stu-2",
    studentName: "\uC774\uC11C\uC5F0",
    date: "2026-05-12",
    time: "10:20",
    duration: 92,
    antecedent: "\uC18C\uC74C \uBC1C\uC0DD",
    behavior: "cry",
    consequence: "\uC9C4\uC815 \uACF5\uAC04 \uC774\uB3D9",
    memo: "\uD5E4\uB4DC\uD3F0\uACFC \uC870\uC6A9\uD55C \uC790\uB9AC\uB97C \uC81C\uACF5\uD568.",
    completed: true,
  },
  {
    id: "rec-3",
    studentId: "stu-3",
    studentName: "\uBC15\uB3C4\uC724",
    date: "2026-05-12",
    time: "11:10",
    duration: 37,
    antecedent: "\uACFC\uC81C \uC81C\uC2DC",
    behavior: "sound",
    consequence: "",
    memo: "\uACFC\uC81C\uB7C9 \uC870\uC815 \uD544\uC694.",
    completed: false,
  },
];

function todayString() {
  return "2026-05-12";
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
  const [selectedStudentId, setSelectedStudentId] = useState(
    studentsSeed[0].id,
  );
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [draft, setDraft] = useState<DraftRecord | null>(null);
  const [pendingRecord, setPendingRecord] = useState<PendingRecord | null>(null);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const [selectedA, setSelectedA] = useState("");
  const [selectedBehavior, setSelectedBehavior] = useState<Behavior | "">("");
  const [selectedC, setSelectedC] = useState("");
  const [memo, setMemo] = useState("");
  const [alertsOn, setAlertsOn] = useState(true);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("");
  const [newStudentSupport, setNewStudentSupport] = useState("");
  const [teacherName, setTeacherName] = useState(T.teacher);
  const [teacherPassword, setTeacherPassword] = useState("");

  const selectedStudent =
    students.find((student) => student.id === selectedStudentId) ?? students[0];
  const todayRecords = records.filter(
    (record) => record.date === todayString(),
  );
  const incompleteRecords = records.filter((record) => !record.completed);
  const riskRecords = records.filter(
    (record) => record.behavior === "selfHarm",
  );

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

  const resetAbc = () => {
    setSelectedA("");
    setSelectedBehavior("");
    setSelectedC("");
    setMemo("");
  };

  const handleStartRecording = () => {
    setElapsed(0);
    setDraft(null);
    setPendingRecord(null);
    setEditingRecordId(null);
    resetAbc();
    setIsRecording(true);
    setScreen("record");
  };

  const handleEndRecording = () => {
    const now = new Date();
    setPendingRecord({
      id: `rec-${records.length + 1}`,
      date: todayString(),
      time: now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      duration: Math.max(elapsed, 1),
    });
    setIsRecording(false);
    setScreen("recordStudent");
  };

  const handleSelectRecordedStudent = (studentId: string) => {
    if (!pendingRecord) return;

    const student = students.find((item) => item.id === studentId);
    if (!student) return;

    setSelectedStudentId(student.id);
    setDraft({
      ...pendingRecord,
      studentId: student.id,
      studentName: student.name,
    });
    setPendingRecord(null);
    setScreen("abc");
  };

  const handleSaveRecord = (completed: boolean) => {
    if (!draft || !selectedBehavior) return;

    const nextRecord: BehaviorRecord = {
      ...draft,
      antecedent: selectedA,
      behavior: selectedBehavior,
      consequence: selectedC,
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
    });
    setEditingRecordId(record.id);
    setSelectedStudentId(record.studentId);
    setSelectedA(record.antecedent);
    setSelectedBehavior(record.behavior);
    setSelectedC(record.consequence);
    setMemo(record.memo);
    setIsRecording(false);
    setScreen("abc");
  };

  const handleOpenNewStudent = () => {
    setNewStudentName("");
    setNewStudentGrade("");
    setNewStudentSupport("");
    setScreen("newStudent");
  };

  const handleSaveStudent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newStudentName.trim();
    if (!name) return;

    const nextStudent: Student = {
      id: `stu-${Date.now()}`,
      name,
      grade: newStudentGrade.trim() || "\uBBF8\uC785\uB825",
      support: newStudentSupport.trim() || "\uC9C0\uC6D0 \uACC4\uD68D \uBBF8\uC785\uB825",
      tone: studentToneOptions[students.length % studentToneOptions.length],
    };

    setStudents((current) => [...current, nextStudent]);
    setSelectedStudentId(nextStudent.id);
    setNewStudentName("");
    setNewStudentGrade("");
    setNewStudentSupport("");
    setScreen("students");
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!teacherName.trim() || !teacherPassword.trim()) return;
    setScreen("home");
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
                    ? "\uD559\uC0DD \uC815\uBCF4 \uC785\uB825"
                    : T.settingsTitle;

  return (
    <main className="min-h-dvh bg-[#dfe9ed] text-slate-900">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#f8fbfb] shadow-2xl shadow-slate-400/30">
        {screen !== "login" && (
          <AppHeader
            title={currentTitle}
            subtitle={screen === "home" ? teacherName : T.className}
            showBack={screen !== "home"}
            onBack={() => {
              if (screen === "newStudent") {
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
              teacherName={teacherName}
              password={teacherPassword}
              onTeacherNameChange={setTeacherName}
              onPasswordChange={setTeacherPassword}
              onLogin={handleLogin}
            />
          )}
          {screen === "home" && (
            <HomeScreen
              todayCount={todayRecords.length}
              incompleteCount={incompleteRecords.length}
              riskCount={riskRecords.length}
              records={records}
              onStart={handleStartRecording}
              onNavigate={setScreen}
              onEditDraft={handleEditDraft}
            />
          )}
          {screen === "record" && (
            <RecordScreen
              students={students}
              selectedStudentId={selectedStudentId}
              selectedStudent={selectedStudent}
              elapsed={elapsed}
              isRecording={isRecording}
              onSelectStudent={setSelectedStudentId}
              onStart={handleStartRecording}
              onEnd={handleEndRecording}
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
              selectedBehavior={selectedBehavior}
              selectedC={selectedC}
              memo={memo}
              onSelectA={setSelectedA}
              onSelectBehavior={setSelectedBehavior}
              onSelectC={setSelectedC}
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
              onAdd={handleOpenNewStudent}
            />
          )}
          {screen === "newStudent" && (
            <NewStudentScreen
              name={newStudentName}
              grade={newStudentGrade}
              support={newStudentSupport}
              onNameChange={setNewStudentName}
              onGradeChange={setNewStudentGrade}
              onSupportChange={setNewStudentSupport}
              onCancel={() => setScreen("students")}
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
  teacherName,
  password,
  onTeacherNameChange,
  onPasswordChange,
  onLogin,
}: {
  teacherName: string;
  password: string;
  onTeacherNameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onLogin: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section className="flex min-h-dvh flex-col justify-center py-8">
      <div className="mb-8 space-y-5">
        <div className="grid size-16 place-items-center rounded-2xl bg-sky-100 text-sky-800">
          <ShieldCheck className="size-8" />
        </div>
        <div>
          <p className="text-sm font-bold text-teal-700">{T.className}</p>
          <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950">
            {T.loginTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {T.loginSubtitle}
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={onLogin}>
        <Card className="rounded-2xl border-0 bg-white shadow-sm">
          <CardContent className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="teacher-name">{"\uAD50\uC0AC\uBA85"}</Label>
              <Input
                id="teacher-name"
                value={teacherName}
                onChange={(event) => onTeacherNameChange(event.target.value)}
                placeholder={"\uC608: \uAE40\uC120\uC0DD\uB2D8"}
                className="h-12 rounded-2xl bg-slate-50"
                autoFocus
                required
              />
            </div>

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

        <Button
          type="submit"
          className="h-14 w-full rounded-2xl bg-sky-700 text-base font-bold text-white shadow-lg shadow-sky-100 hover:bg-sky-800"
          disabled={!teacherName.trim() || !password.trim()}
        >
          <LogIn className="mr-2 size-5" />
          {"\uB85C\uADF8\uC778"}
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
  riskCount,
  records,
  onStart,
  onNavigate,
  onEditDraft,
}: {
  todayCount: number;
  incompleteCount: number;
  riskCount: number;
  records: BehaviorRecord[];
  onStart: () => void;
  onNavigate: (screen: Screen) => void;
  onEditDraft: (record: BehaviorRecord) => void;
}) {
  return (
    <section className="space-y-4 pt-4">
      <div className="grid grid-cols-3 gap-2">
        <MetricCard
          label={T.todayRecords}
          value={todayCount}
          icon={<ClipboardList className="size-5" />}
          tone="sky"
        />
        <MetricCard
          label={T.incomplete}
          value={incompleteCount}
          icon={<Clock3 className="size-5" />}
          tone="orange"
        />
        <MetricCard
          label={T.riskWatch}
          value={riskCount}
          icon={<AlertTriangle className="size-5" />}
          tone="mint"
        />
      </div>

      <Button
        type="button"
        onClick={onStart}
        className="h-16 w-full rounded-2xl bg-sky-700 text-base font-bold text-white shadow-lg shadow-sky-100 hover:bg-sky-800"
      >
        <Play className="mr-2 size-5 fill-white" />
        {T.startNow}
      </Button>

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

      <div className="grid grid-cols-2 gap-3">
        <QuickLink
          icon={<BarChart3 className="size-5" />}
          label={T.analysisTitle}
          onClick={() => onNavigate("analysis")}
        />
        <QuickLink
          icon={<Users className="size-5" />}
          label={T.studentManage}
          onClick={() => onNavigate("students")}
        />
      </div>
    </section>
  );
}

function RecordScreen({
  students,
  selectedStudentId,
  selectedStudent,
  elapsed,
  isRecording,
  onSelectStudent,
  onStart,
  onEnd,
}: {
  students: Student[];
  selectedStudentId: string;
  selectedStudent: Student;
  elapsed: number;
  isRecording: boolean;
  onSelectStudent: (id: string) => void;
  onStart: () => void;
  onEnd: () => void;
}) {
  return (
    <section className="space-y-4 pt-4">
      {!isRecording && (
        <Card className="rounded-2xl border-0 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">{T.selectStudent}</CardTitle>
            <p className="text-sm text-slate-500">{T.selectStudentHelp}</p>
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
          <div>
            <p className="text-sm text-sky-100">
              {isRecording
                ? "\uB179\uC74C \uD6C4 \uD559\uC0DD\uC744 \uC120\uD0DD\uD569\uB2C8\uB2E4"
                : selectedStudent.support}
            </p>
            <p className="mt-1 text-3xl font-black">
              {isRecording ? T.recording : selectedStudent.name}
            </p>
          </div>
          <p className="text-6xl font-black tabular-nums">
            {formatDuration(elapsed)}
          </p>
          {!isRecording ? (
            <Button
              type="button"
              className="h-14 w-full rounded-2xl bg-white font-bold text-sky-800 hover:bg-sky-50"
              onClick={onStart}
            >
              <Play className="mr-2 size-5 fill-sky-800" />
              {T.startRecord}
            </Button>
          ) : (
            <Button
              type="button"
              className="h-14 w-full rounded-2xl bg-orange-400 font-bold text-white hover:bg-orange-500"
              onClick={onEnd}
            >
              <Square className="mr-2 size-5 fill-white" />
              {T.endBehavior}
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function AbcInputScreen({
  draft,
  selectedA,
  selectedBehavior,
  selectedC,
  memo,
  onSelectA,
  onSelectBehavior,
  onSelectC,
  onMemo,
  onSave,
}: {
  draft: DraftRecord;
  selectedA: string;
  selectedBehavior: Behavior | "";
  selectedC: string;
  memo: string;
  onSelectA: (value: string) => void;
  onSelectBehavior: (value: Behavior) => void;
  onSelectC: (value: string) => void;
  onMemo: (value: string) => void;
  onSave: (completed: boolean) => void;
}) {
  const ready = Boolean(selectedA && selectedBehavior && selectedC);

  return (
    <section className="space-y-4 pt-4">
      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-slate-500">{draft.time}</p>
            <p className="text-xl font-black">{draft.studentName}</p>
          </div>
          <Badge className="rounded-full bg-orange-100 text-orange-800 hover:bg-orange-100">
            {formatDuration(draft.duration)}
          </Badge>
        </CardContent>
      </Card>

      <ChipGroup
        title={T.antecedent}
        options={antecedentOptions}
        selected={selectedA}
        onSelect={onSelectA}
      />
      <BehaviorChipGroup
        selected={selectedBehavior}
        onSelect={onSelectBehavior}
      />
      <ChipGroup
        title={T.consequence}
        options={consequenceOptions}
        selected={selectedC}
        onSelect={onSelectC}
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
          disabled={!selectedBehavior}
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
  onAdd,
}: {
  students: Student[];
  records: BehaviorRecord[];
  onAdd: () => void;
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
      {students.map((student) => {
        const count = records.filter(
          (record) => record.studentId === student.id,
        ).length;
        return (
          <Card
            key={student.id}
            className="rounded-2xl border-0 bg-white shadow-sm"
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
                  {student.grade} · {student.support}
                </p>
              </div>
              <Badge variant="secondary" className="rounded-full">
                {count}
                {"\uAC74"}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}

function NewStudentScreen({
  name,
  grade,
  support,
  onNameChange,
  onGradeChange,
  onSupportChange,
  onCancel,
  onSave,
}: {
  name: string;
  grade: string;
  support: string;
  onNameChange: (value: string) => void;
  onGradeChange: (value: string) => void;
  onSupportChange: (value: string) => void;
  onCancel: () => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="space-y-4 pt-4" onSubmit={onSave}>
      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{"\uD559\uC0DD \uC815\uBCF4"}</CardTitle>
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
            <Label htmlFor="student-support">{"\uC9C0\uC6D0 \uBA54\uBAA8"}</Label>
            <Textarea
              id="student-support"
              value={support}
              onChange={(event) => onSupportChange(event.target.value)}
              placeholder={"\uC608: \uC804\uD658 \uC0C1\uD669 \uC0AC\uC804 \uC608\uACE0"}
              className="min-h-28 rounded-2xl bg-slate-50"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-2xl font-bold"
          onClick={onCancel}
        >
          {"\uCDE8\uC18C"}
        </Button>
        <Button
          type="submit"
          className="h-12 rounded-2xl bg-orange-400 font-bold text-white hover:bg-orange-500"
          disabled={!name.trim()}
        >
          <Check className="mr-2 size-5" />
          {"\uC800\uC7A5"}
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
              <Bell className="size-5" />
            </div>
            <div>
              <p className="font-bold">
                {"\uC704\uD5D8 \uD589\uB3D9 \uC54C\uB9BC"}
              </p>
              <p className="text-sm text-slate-500">
                {
                  "\uC790\uD574 \uC2DC\uB3C4 \uAE30\uB85D \uC2DC \uC0C1\uB2E8 \uC54C\uB9BC \uD45C\uC2DC"
                }
              </p>
            </div>
          </div>
          <Switch checked={alertsOn} onCheckedChange={onAlertsChange} />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-0 bg-white shadow-sm">
        <CardContent className="space-y-3 p-4">
          <p className="font-bold">{"\uB370\uBAA8 \uD658\uACBD"}</p>
          <div className="rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
            {
              "mock data\uC640 React state\uB9CC \uC0AC\uC6A9\uD558\uB294 \uD074\uB9AD \uAC00\uB2A5\uD55C \uD504\uB860\uD2B8\uC5D4\uB4DC \uD504\uB85C\uD1A0\uD0C0\uC785\uC785\uB2C8\uB2E4."
            }
          </div>
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
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
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
      </CardContent>
    </Card>
  );
}

function BehaviorChipGroup({
  selected,
  onSelect,
}: {
  selected: Behavior | "";
  onSelect: (value: Behavior) => void;
}) {
  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{T.behavior}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
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
            {meta.label}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {record.time} · {formatDuration(record.duration)} ·{" "}
            {record.antecedent || "-"}
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

function MetricCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  tone: "sky" | "mint" | "orange";
}) {
  const toneClass = {
    sky: "bg-sky-100 text-sky-800",
    mint: "bg-teal-100 text-teal-800",
    orange: "bg-orange-100 text-orange-800",
  }[tone];

  return (
    <Card className="rounded-2xl border-0 bg-white shadow-sm">
      <CardContent className="p-3">
        <div
          className={`mb-3 grid size-9 place-items-center rounded-2xl ${toneClass}`}
        >
          {icon}
        </div>
        <p className="text-2xl font-black">{value}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
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
    { id: "record" as Screen, label: T.record, icon: Mic },
    { id: "records" as Screen, label: T.records, icon: FileText },
    { id: "analysis" as Screen, label: T.analysis, icon: BarChart3 },
    { id: "students" as Screen, label: T.students, icon: Users },
    { id: "settings" as Screen, label: T.settings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[430px] -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="grid h-20 grid-cols-6">
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
