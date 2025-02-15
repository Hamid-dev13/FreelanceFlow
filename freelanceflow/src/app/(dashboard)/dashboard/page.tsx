// src/app/(dashboard)/dashboard/page.tsx
import { Suspense } from 'react';
import { DashboardClient } from './DashboardClient';
import DashboardLoading from './_components/shared/DashboardLoading';

export default function Page() {
    return (
        <Suspense fallback={<DashboardLoading />}>
            <DashboardClient />
        </Suspense>
    );
}