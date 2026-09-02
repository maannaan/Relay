export type RiskKind = 'equipment' | 'cash' | 'stock' | 'other'
export type RiskStatus = 'candidate' | 'unowned' | 'drafted' | 'blocked' | 'ready'
export type Severity = 'critical' | 'medium' | 'low'

export type Risk = {
  id: string
  kind: RiskKind
  title: string
  detail: string
  severity: Severity
  status: RiskStatus
  owner?: string
  deadline?: string
  fallback?: string
  sourceNoteId?: string
}

export type Note = { id: string; time: string; author: string; text: string; tag: string }

export type Audit = { time: string; event: string; actor: string; tone: 'agent' | 'manager' | 'system' }

export type RosterEntry = { name: string; role: string; available: string }

export type Proposal = { owner: string; deadline: string; fallback: string }

export type LocationState = {
  id: string
  name: string
  area: string
  shift: string
  timestamp: string
  policy: string
  roster: RosterEntry[]
  notes: Note[]
  risks: Risk[]
  audit: Audit[]
}

const fridgeProposal: Proposal = {
  owner: 'Maya · Opening lead',
  deadline: 'Tomorrow · 7:30 AM',
  fallback: 'If above 5°C: isolate stock and call the manager.',
}

const tillProposal: Proposal = {
  owner: 'Arjun · Bar',
  deadline: 'Tomorrow · 9:00 AM',
  fallback: 'Recount with two staff present before the bank drop.',
}

export const proposals: Record<string, Proposal> = {
  fridge: fridgeProposal,
  till: tillProposal,
}

export function seedLocations(): LocationState[] {
  return [
    {
      id: 'northstar',
      name: 'Northstar Coffee',
      area: 'Indiranagar',
      shift: 'Closing · 2:00 PM–10:00 PM',
      timestamp: 'Tuesday, 1 September · 9:52 PM',
      policy: 'For chilled stock incidents: verify temperature before opening. Above 5°C requires manager escalation.',
      roster: [
        { name: 'Maya', role: 'Opening lead', available: '7:00 AM–3:00 PM' },
        { name: 'Arjun', role: 'Bar', available: '8:00 AM–4:00 PM' },
        { name: 'Meera', role: 'Floor', available: '9:00 AM–5:00 PM' },
      ],
      notes: [
        { id: 'ns-note-1', time: '9:46 PM', author: 'Rohan · Closing lead', text: 'Walk-in fridge stayed at 9°C after the door was fixed. Called CoolTech; they said they may come tomorrow. Milk moved to the small fridge. I’m heading out.', tag: 'Equipment' },
        { id: 'ns-note-2', time: '9:32 PM', author: 'Rohan · Closing lead', text: 'Till looks ₹420 over. I did a quick recount, but the dinner rush receipts need another look.', tag: 'Cash' },
        { id: 'ns-note-3', time: '9:08 PM', author: 'Meera · Bar', text: 'Beans are low. Sunrise Roasters confirmed an 8:15 AM delivery.', tag: 'Stock' },
      ],
      risks: [
        { id: 'fridge', kind: 'equipment', title: 'Walk-in fridge temperature', detail: '9°C after door repair. CoolTech attendance is unconfirmed.', severity: 'critical', status: 'unowned', sourceNoteId: 'ns-note-1' },
        { id: 'till', kind: 'cash', title: 'Till discrepancy', detail: '₹420 cash variance needs a count before tomorrow’s close.', severity: 'medium', status: 'blocked', owner: 'Arjun', deadline: 'Tomorrow · 5:00 PM', sourceNoteId: 'ns-note-2' },
        { id: 'beans', kind: 'stock', title: 'Espresso bean delivery', detail: 'Supplier ETA confirmed for 8:15 AM.', severity: 'low', status: 'ready', owner: 'Maya', deadline: 'Tomorrow · 8:30 AM' },
      ],
      audit: [
        { time: '9:46 PM', event: 'Closing note added: walk-in fridge stayed at 9°C.', actor: 'Rohan · Closing lead', tone: 'manager' },
        { time: '9:48 PM', event: 'Incident linked to the equipment log.', actor: 'Relay', tone: 'system' },
      ],
    },
    {
      id: 'parkstreet',
      name: 'Park Street Coffee',
      area: 'Koramangala',
      shift: 'Closing · 1:00 PM–9:00 PM',
      timestamp: 'Tuesday, 1 September · 9:10 PM',
      policy: 'For supplier delays: confirm a backup vendor before the shift ends.',
      roster: [
        { name: 'Divya', role: 'Opening lead', available: '6:30 AM–2:30 PM' },
        { name: 'Kabir', role: 'Bar', available: '7:00 AM–3:00 PM' },
      ],
      notes: [
        { id: 'ps-note-1', time: '9:02 PM', author: 'Priya · Closing lead', text: 'Oat milk supplier pushed delivery to noon instead of 7 AM. Divya knows and will use the backup case in the walk-in until it arrives.', tag: 'Stock' },
        { id: 'ps-note-2', time: '8:40 PM', author: 'Priya · Closing lead', text: 'Till balanced exactly at close. No variance.', tag: 'Cash' },
      ],
      risks: [
        { id: 'oatmilk', kind: 'stock', title: 'Oat milk supplier delay', detail: 'Delivery pushed to 12:00 PM; backup case confirmed on hand.', severity: 'medium', status: 'ready', owner: 'Divya', deadline: 'Tomorrow · 6:30 AM' },
        { id: 'till-ps', kind: 'cash', title: 'Till reconciliation', detail: 'Balanced at close, no variance.', severity: 'low', status: 'ready', owner: 'Priya', deadline: 'Closed out tonight' },
      ],
      audit: [
        { time: '8:40 PM', event: 'Till balanced with no variance.', actor: 'Priya · Closing lead', tone: 'manager' },
        { time: '9:02 PM', event: 'Backup oat milk case confirmed for tomorrow.', actor: 'Priya · Closing lead', tone: 'manager' },
      ],
    },
  ]
}
