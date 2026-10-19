import AdminDashboardRoot from '@/components/admin/AdminDashboardRoot';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Studio Admin | InderPushp',
  description: 'Manage mosaic art collections, ImageKit media, availability, and gallery curation.',
};

export default function AdminPage() {
  return <AdminDashboardRoot />;
}
