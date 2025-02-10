// src/app/(dashboard)/freelance/rapport-mensuel/page.tsx
"use client"

import { useState, useEffect } from 'react'
import {
    Calendar,
    FileText,
    Download,
    Filter
} from 'lucide-react'

type MensuelReport = {
    mission: {
        id: string
        title: string
        project: {
            title: string
            client: {
                name: string
            }
        }
    }
    totalHours: number
    timeEntries: {
        id: string
        startTime: string
        endTime: string
        duration: number
        description?: string
    }[]
}

export default function RapportMensuel() {
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
    const [reports, setReports] = useState<MensuelReport[]>([])
    const [totalMonthlyHours, setTotalMonthlyHours] = useState(0)

    useEffect(() => {
        const fetchMonthlyReport = async () => {
            try {
                const response = await fetch(`/api/reports/monthly?year=${selectedMonth.getFullYear()}&month=${selectedMonth.getMonth() + 1}`)
                const data = await response.json()

                setReports(data.missions)
                setTotalMonthlyHours(data.totalHours)
            } catch (error) {
                console.error('Erreur de chargement du rapport mensuel:', error)
            }
        }

        fetchMonthlyReport()
    }, [selectedMonth])

    const handleExportPDF = async () => {
        try {
            const response = await fetch(`/api/reports/monthly/export?year=${selectedMonth.getFullYear()}&month=${selectedMonth.getMonth() + 1}`)
            const blob = await response.blob()

            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `rapport-${selectedMonth.getFullYear()}-${selectedMonth.getMonth() + 1}.pdf`
            document.body.appendChild(a)
            a.click()
            a.remove()
        } catch (error) {
            console.error('Erreur d\'export:', error)
        }
    }

    const handlePreviousMonth = () => {
        const newDate = new Date(selectedMonth)
        newDate.setMonth(newDate.getMonth() - 1)
        setSelectedMonth(newDate)
    }

    const handleNextMonth = () => {
        const newDate = new Date(selectedMonth)
        newDate.setMonth(newDate.getMonth() + 1)
        setSelectedMonth(newDate)
    }

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center">
                    <FileText className="mr-3" /> Rapport Mensuel
                </h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handlePreviousMonth}
                        className="bg-gray-800 p-2 rounded"
                    >
                        &lt;
                    </button>
                    <span className="text-xl font-semibold">
                        {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                        onClick={handleNextMonth}
                        className="bg-gray-800 p-2 rounded"
                    >
                        &gt;
                    </button>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-semibold">Total Heures</h2>
                        <p className="text-3xl font-bold">{totalMonthlyHours.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={handleExportPDF}
                        className="bg-[#FF4405] text-white px-4 py-2 rounded flex items-center"
                    >
                        <Download className="mr-2" /> Exporter PDF
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {reports.map((report) => (
                    <div
                        key={report.mission.id}
                        className="bg-gray-800 p-4 rounded-lg"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{report.mission.title}</h3>
                                <p className="text-gray-400">
                                    Projet: {report.mission.project.title}
                                    | Client: {report.mission.project.client.name}
                                </p>
                            </div>
                            <span className="font-semibold text-[#FF4405]">
                                {report.totalHours.toFixed(2)} h
                            </span>
                        </div>

                        <div className="space-y-2">
                            {report.timeEntries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="bg-gray-700 p-2 rounded flex justify-between"
                                >
                                    <div>
                                        <p>{entry.description || 'Aucune description'}</p>
                                        <p className="text-sm text-gray-400">
                                            {new Date(entry.startTime).toLocaleString()} -
                                            {new Date(entry.endTime).toLocaleString()}
                                        </p>
                                    </div>
                                    <span>{entry.duration.toFixed(2)} h</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}