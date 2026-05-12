"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  BarChart3,
  Check,
  ChevronLeft,
  ClipboardList,
  Clock3,
  Home,
  Mic,
  Play,
  Square,
  UserRound,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type Screen = "home" | "record" | "abc" | "analysis"

type Student = {
  id: string
  name: string
  grade: string
  color: string
}

type BehaviorRecord = {
  id: string
  studentId: string
  studentName: string
  time: string
  duration: number
  antecedent?: string
  behavior?: string
  consequence?: string
  complete: boolean
}

const students: Student[] = [
  { id: "s1", name: "김민수", grade: "초2", color: "bg-sky-100 text-sky-700" },
  { id: "s2", name: "이서윤", grade: "초3", color: "bg-amber-100 text-amber-700" },
  { id: "s3", name: "박지호", grade: "초4", color: "bg-emerald-100 text-emerald-700" },
  { id: "s4", name: "최수아", grade: "초5", color: "bg-rose-100 text-rose-700" },
]

const antecedents = ["과제 제시", "소음 발생", "친구와 갈등", "활동 전환", "대기 시간", "지시 이해 어려움"]
const behaviors = ["자리 이탈", "소리 지르기", "울음", "물건 던지기", "거부 행동", "책상 두드림"]
const consequences = ["언어적 안내", "진정 공간 이동", "감각 도구 제공", "휴식", "활동 재안내", "관찰 지속"]

const initialRecords: BehaviorRecord[] = [
  {
    id: "r1",
    studentId: "s1",
    studentName: "김민수",
    time: "09:35",
    duration: 45,
    antecedent: "과제 제시",
    behavior: "자리 이탈",
    consequence: "언어적 안내",
    complete: true,
  },
  {
    id: "r2",
    studentId: "s2",
    studentName: "이서윤",
    time: "10:20",
    duration: 30,
    antecedent: "소음 발생",
    behavior: "울음",
    consequence: "진정 공간 이동",
    complete: true,
  },
  {
    id: "r3",
    studentId: "s1",
    studentName: "김민수",
    time: "11:10",
    duration: 60,
    behavior: "소리 지르기",
    complete: false,
  },
]

const chartData = [
  { name: "민수", "자리 이탈": 7, "소리 지르기": 4, 울음: 1 },
  { name: "서윤", "자리 이탈": 3, "소리 지르기": 2, 울음: 5 },
  { name: "지호", "자리 이탈": 4, "소리 지르기": 5, 울음: 2 },
  { name: "수아", "자리 이탈": 2, "소리 지르기": 1, 울음: 3 },
]

export default function AppPage() {
  const [screen, setScreen] = useState<Screen>("home")
  const [records, setRecords] = useState<BehaviorRecord[]>(initialRecords)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [draft, setDraft] = useState<BehaviorRecord | null>(null)
  const [selectedA, setSelectedA] = useState("")
  const [selectedB, setSelectedB] = useState("")
  const [selectedC, setSelectedC] = useState("")

  const incompleteCount = records.filter((record) => !record.complete).length
  const selectedStudentRecordCount = useMemo(() => {
    if (!selectedStudent) return 0
    return records.filter((record) => record.studentId === selectedStudent.id).length
  }, [records, selectedStudent])

  useEffect(() => {
    if (!recording) return
    const timer = window.setInterval(() => {
      setSeconds((current) => current + 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [recording])

  const startRecording = () => {
    if (!selectedStudent) return
    setRecording(true)
    setSeconds(0)
  }

  const finishRecording = () => {
    if (!selectedStudent) return
    const now = new Date()
    setDraft({
      id: `r-${records.length + 1}`,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      time: now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }),
      duration: seconds,
      complete: false,
    })
    setRecording(false)
    setScreen("abc")
  }

  const saveRecord = (complete: boolean) => {
    if (!draft) return
    setRecords([
      {
        ...draft,
        antecedent: selectedA,
        behavior: selectedB,
        consequence: selectedC,
        complete,
      },
      ...records,
    ])
    setDraft(null)
    setSelectedStudent(null)
    setSelectedA("")
    setSelectedB("")
    setSelectedC("")
    setSeconds(0)
    setScreen("home")
  }

  return (
    <main className="min-h-dvh bg-[#e8edf1] text-slate-950">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-[#f8fafc] shadow-2xl shadow-slate-300/70">
        <div className="flex-1 overflow-y-auto pb-24">
          {screen === "home" && (
            <HomeScreen
              records={records}
              incompleteCount={incompleteCount}
              onRecord={() => setScreen("record")}
              onAnalysis={() => setScreen("analysis")}
            />
          )}
          {screen === "record" && (
            <RecordScreen
              students={students}
              selectedStudent={selectedStudent}
              selectedStudentRecordCount={selectedStudentRecordCount}
              recording={recording}
              seconds={seconds}
              onBack={() => {
                setRecording(false)
                setSelectedStudent(null)
                setScreen("home")
              }}
              onSelectStudent={setSelectedStudent}
              onStart={startRecording}
              onFinish={finishRecording}
            />
          )}
          {screen === "abc" && draft && (
            <AbcScreen
              draft={draft}
              selectedA={selectedA}
              selectedB={selectedB}
              selectedC={selectedC}
              onBack={() => setScreen("record")}
              onSelectA={setSelectedA}
              onSelectB={setSelectedB}
              onSelectC={setSelectedC}
              onSave={saveRecord}
            />
          )}
          {screen === "analysis" && <AnalysisScreen onBack={() => setScreen("home")} />}
        </div>
        <BottomNav active={screen} onNavigate={setScreen} />
      </div>
    </main>
  )
}

function HomeScreen({
  records,
  incompleteCount,
  onRecord,
  onAnalysis,
}: {
  records: BehaviorRecord[]
  incompleteCount: number
  onRecord: () => void
  onAnalysis: () => void
}) {
  return (
    <section className="space-y-5 px-5 pt-6">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">특수교육 행동 기록</p>
          <h1 className="mt-1 text-2xl font-bold tracking-normal">ABC 기록</h1>
        </div>
        <div className="grid size-11 place-items-center rounded-full bg-slate-900 text-white">
          <ClipboardList className="size-5" />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="오늘 기록" value={records.length} icon={<Activity className="size-5" />} />
        <Stat label="미완료" value={incompleteCount} icon={<Clock3 className="size-5" />} />
      </div>

      <button
        type="button"
        onClick={onRecord}
        className="flex h-16 w-full items-center justify-center gap-3 rounded-[18px] bg-slate-950 text-base font-semibold text-white shadow-lg shadow-slate-300 active:scale-[0.99]"
      >
        <Play className="size-5 fill-white" />
        즉시 기록 시작
      </button>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">최근 기록</h2>
        <button type="button" onClick={onAnalysis} className="text-sm font-semibold text-sky-700">
          분석 보기
        </button>
      </div>

      <div className="space-y-3">
        {records.map((record) => (
          <article key={record.id} className="rounded-[18px] border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-slate-100 text-slate-700">
                  <UserRound className="size-5" />
                </div>
                <div>
                  <p className="font-semibold">{record.studentName}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {record.behavior ?? "행동 미입력"} · {record.duration}초 · {record.time}
                  </p>
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${record.complete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {record.complete ? "완료" : "미완료"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function RecordScreen({
  students,
  selectedStudent,
  selectedStudentRecordCount,
  recording,
  seconds,
  onBack,
  onSelectStudent,
  onStart,
  onFinish,
}: {
  students: Student[]
  selectedStudent: Student | null
  selectedStudentRecordCount: number
  recording: boolean
  seconds: number
  onBack: () => void
  onSelectStudent: (student: Student) => void
  onStart: () => void
  onFinish: () => void
}) {
  return (
    <section className="space-y-5 px-5 pt-6">
      <ScreenHeader title="실시간 기록" onBack={onBack} />

      {!recording && (
        <>
          <div>
            <h2 className="text-base font-semibold">학생 선택</h2>
            <p className="mt-1 text-sm text-slate-500">행동이 관찰된 학생을 먼저 선택하세요.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {students.map((student) => (
              <button
                type="button"
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className={`min-h-24 rounded-[18px] border p-4 text-left transition ${
                  selectedStudent?.id === student.id
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200 bg-white text-slate-950"
                }`}
              >
                <div className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${selectedStudent?.id === student.id ? "bg-white/15 text-white" : student.color}`}>
                  {student.grade}
                </div>
                <p className="text-lg font-bold">{student.name}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {selectedStudent && (
        <div className="rounded-[22px] bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">선택 학생</p>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{selectedStudent.name}</p>
              <p className="mt-1 text-sm text-slate-500">오늘 기록 {selectedStudentRecordCount}건</p>
            </div>
            {recording && <div className="size-4 rounded-full bg-red-500 shadow-[0_0_0_8px_rgba(239,68,68,0.12)]" />}
          </div>
          {recording && <p className="mt-5 text-center text-5xl font-black tabular-nums">{seconds.toString().padStart(2, "0")}초</p>}
        </div>
      )}

      {!recording ? (
        <button
          type="button"
          disabled={!selectedStudent}
          onClick={onStart}
          className="flex h-16 w-full items-center justify-center gap-3 rounded-[18px] bg-sky-700 text-base font-semibold text-white shadow-lg shadow-sky-200 disabled:bg-slate-300 disabled:shadow-none"
        >
          <Mic className="size-5" />
          기록 시작
        </button>
      ) : (
        <button
          type="button"
          onClick={onFinish}
          className="flex h-16 w-full items-center justify-center gap-3 rounded-[18px] bg-red-600 text-base font-semibold text-white shadow-lg shadow-red-200"
        >
          <Square className="size-5 fill-white" />
          행동 종료
        </button>
      )}
    </section>
  )
}

function AbcScreen({
  draft,
  selectedA,
  selectedB,
  selectedC,
  onBack,
  onSelectA,
  onSelectB,
  onSelectC,
  onSave,
}: {
  draft: BehaviorRecord
  selectedA: string
  selectedB: string
  selectedC: string
  onBack: () => void
  onSelectA: (value: string) => void
  onSelectB: (value: string) => void
  onSelectC: (value: string) => void
  onSave: (complete: boolean) => void
}) {
  const complete = Boolean(selectedA && selectedB && selectedC)

  return (
    <section className="space-y-5 px-5 pt-6">
      <ScreenHeader title="ABC 입력" onBack={onBack} />
      <div className="rounded-[22px] bg-slate-950 p-5 text-white">
        <p className="text-sm text-slate-300">기록 대상</p>
        <p className="mt-1 text-2xl font-bold">{draft.studentName}</p>
        <p className="mt-2 text-sm text-slate-300">{draft.duration}초 관찰 기록</p>
      </div>

      <OptionGroup title="A. 선행 사건" options={antecedents} selected={selectedA} onSelect={onSelectA} />
      <OptionGroup title="B. 행동" options={behaviors} selected={selectedB} onSelect={onSelectB} />
      <OptionGroup title="C. 결과" options={consequences} selected={selectedC} onSelect={onSelectC} />

      <div className="grid grid-cols-2 gap-3">
        <button type="button" onClick={() => onSave(false)} className="h-14 rounded-[16px] border border-slate-300 bg-white font-semibold">
          임시 저장
        </button>
        <button
          type="button"
          disabled={!complete}
          onClick={() => onSave(true)}
          className="flex h-14 items-center justify-center gap-2 rounded-[16px] bg-slate-950 font-semibold text-white disabled:bg-slate-300"
        >
          <Check className="size-5" />
          완료
        </button>
      </div>
    </section>
  )
}

function AnalysisScreen({ onBack }: { onBack: () => void }) {
  return (
    <section className="space-y-5 px-5 pt-6">
      <ScreenHeader title="분석" onBack={onBack} />
      <div className="rounded-[22px] bg-white p-5">
        <p className="text-sm font-medium text-slate-500">이번 주 패턴</p>
        <p className="mt-2 text-lg font-bold">활동 전환 직후 자리 이탈이 가장 많이 관찰됩니다.</p>
      </div>
      <div className="rounded-[22px] bg-white p-4">
        <h2 className="mb-4 font-semibold">학생별 행동 빈도</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="자리 이탈" fill="#0369a1" radius={[6, 6, 0, 0]} />
              <Bar dataKey="소리 지르기" fill="#0f766e" radius={[6, 6, 0, 0]} />
              <Bar dataKey="울음" fill="#b45309" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}

function OptionGroup({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string
  options: string[]
  selected: string
  onSelect: (value: string) => void
}) {
  return (
    <div className="space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onSelect(option)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              selected === option ? "bg-slate-950 text-white" : "bg-white text-slate-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-[18px] bg-white p-4 shadow-sm">
      <div className="mb-4 grid size-10 place-items-center rounded-full bg-slate-100 text-slate-700">{icon}</div>
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
    </div>
  )
}

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="flex items-center gap-3">
      <button type="button" onClick={onBack} className="grid size-11 place-items-center rounded-full bg-white">
        <ChevronLeft className="size-6" />
      </button>
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  )
}

function BottomNav({ active, onNavigate }: { active: Screen; onNavigate: (screen: Screen) => void }) {
  const items = [
    { id: "home" as Screen, label: "홈", icon: Home },
    { id: "record" as Screen, label: "기록", icon: Clock3 },
    { id: "analysis" as Screen, label: "분석", icon: BarChart3 },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="grid h-16 grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon
          const selected = active === item.id || (item.id === "record" && active === "abc")
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 text-xs font-semibold ${selected ? "text-slate-950" : "text-slate-400"}`}
            >
              <Icon className="size-5" />
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
