import { prisma } from '@/lib/prisma';
import type { ContactRequestInput } from '@/modules/contact/contact.schema';

export function createContactRequest(artworkId: string, data: ContactRequestInput) {
  return prisma.contactRequest.create({ data: { ...data, artworkId } });
}

export function listContactRequests() {
  return prisma.contactRequest.findMany({
    include: { artwork: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function updateContactRequestStatus(id: string, status: 'PENDING' | 'CONTACTED' | 'CLOSED') {
  return prisma.contactRequest.update({ where: { id }, data: { status } });
}
