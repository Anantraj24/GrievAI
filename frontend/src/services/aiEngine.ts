import { AIAnalysisResult, ExtractedEntity, Grievance, PriorityLevel, SimilarGrievance } from '../types';
import { storage } from './storage';

/**
 * Intelligent Local AI Simulation Engine for GrievAI
 * Implements real-time NLP classification, entity extraction, duplicate search, and response drafting.
 */

export class AIEngine {
  /**
   * Analyze grievance text and location in real time.
   */
  public static analyze(text: string, location?: string): AIAnalysisResult {
    const lower = text.toLowerCase();
    const locLower = (location || '').toLowerCase();

    // 1. Determine Category & Subcategory
    let category = 'Estate & Campus Facilities';
    let subcategory = 'General Maintenance';
    let recommendedDepartment = 'Estate & Campus Facilities';
    let routingReason = 'Routed to Estate & Campus Facilities for facility inspection and work dispatch.';

    if (
      lower.includes('grade') ||
      lower.includes('exam') ||
      lower.includes('marks') ||
      lower.includes('professor') ||
      lower.includes('faculty') ||
      lower.includes('course') ||
      lower.includes('syllabus') ||
      lower.includes('credits')
    ) {
      category = 'Academic Affairs';
      recommendedDepartment = 'Academic Affairs & Evaluations';
      if (lower.includes('grade') || lower.includes('marks') || lower.includes('score')) {
        subcategory = 'Grade Discrepancy';
        routingReason = 'Grade calculation dispute requiring course coordinator answer-sheet review.';
      } else if (lower.includes('exam') || lower.includes('timetable') || lower.includes('clash')) {
        subcategory = 'Exam Timetable Clash';
        routingReason = 'Examination committee scheduling reconciliation required.';
      } else {
        subcategory = 'Course Registration & Faculty';
        routingReason = 'Academic advisory and department chairperson review.';
      }
    } else if (
      lower.includes('wifi') ||
      lower.includes('wi-fi') ||
      lower.includes('internet') ||
      lower.includes('network') ||
      lower.includes('portal') ||
      lower.includes('erp') ||
      lower.includes('login') ||
      lower.includes('server') ||
      lower.includes('software') ||
      lower.includes('computer')
    ) {
      category = 'IT & Digital Services';
      recommendedDepartment = 'IT Infrastructure & Digital Services';
      if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('network') || lower.includes('internet')) {
        subcategory = 'Wi-Fi / LAN Downtime';
        routingReason = 'Network Operations Center (NOC) access point telemetry investigation.';
      } else if (lower.includes('portal') || lower.includes('erp') || lower.includes('login')) {
        subcategory = 'Student Portal / ERP Bugs';
        routingReason = 'Enterprise software development and identity access management team.';
      } else {
        subcategory = 'Lab Workstation Failure';
        routingReason = 'Hardware technician and lab administrator maintenance queue.';
      }
    } else if (
      lower.includes('mess') ||
      lower.includes('food') ||
      lower.includes('hostel') ||
      lower.includes('room') ||
      lower.includes('warden') ||
      lower.includes('dining') ||
      lower.includes('bed')
    ) {
      category = 'Hostel & Residence';
      recommendedDepartment = 'Hostel Administration & Dining';
      if (lower.includes('food') || lower.includes('mess') || lower.includes('dining')) {
        subcategory = 'Mess Food Quality & Hygiene';
        routingReason = 'Hostel catering committee and campus health inspector audit.';
      } else {
        subcategory = 'Room Allocation & Maintenance';
        routingReason = 'Hostel warden office maintenance and facility allocation protocol.';
      }
    } else if (
      lower.includes('harass') ||
      lower.includes('bully') ||
      lower.includes('ragging') ||
      lower.includes('threat') ||
      lower.includes('dark') ||
      lower.includes('safety') ||
      lower.includes('security')
    ) {
      category = 'Campus Safety & Harassment';
      recommendedDepartment = 'Estate & Campus Facilities';
      subcategory = lower.includes('dark') || lower.includes('light') ? 'Campus Lighting / Dark Zones' : 'Campus Safety & Harassment Incident';
      routingReason = 'Immediate security supervisor dispatch and campus internal complaints committee alert.';
    } else if (
      lower.includes('fee') ||
      lower.includes('refund') ||
      lower.includes('payment') ||
      lower.includes('account') ||
      lower.includes('scholarship') ||
      lower.includes('money') ||
      lower.includes('receipt')
    ) {
      category = 'Finance & Accounts';
      recommendedDepartment = 'Finance & Student Accounts';
      subcategory = 'Fee & Payment Discrepancy';
      routingReason = 'Accounts reconciliation team for bank transaction verification.';
    } else if (
      lower.includes('water') ||
      lower.includes('leak') ||
      lower.includes('ac') ||
      lower.includes('air condition') ||
      lower.includes('pipe') ||
      lower.includes('fan') ||
      lower.includes('chair') ||
      lower.includes('elevator')
    ) {
      category = 'Estate & Campus Facilities';
      recommendedDepartment = 'Estate & Campus Facilities';
      if (lower.includes('water') || lower.includes('leak') || lower.includes('pipe')) {
        subcategory = 'Plumbing & Water Supply';
        routingReason = 'Emergency plumbing engineering crew dispatch.';
      } else if (lower.includes('ac') || lower.includes('air condition') || lower.includes('hvac')) {
        subcategory = 'HVAC & Air Conditioning';
        routingReason = 'Central HVAC maintenance contractor ticket generation.';
      } else {
        subcategory = 'Classroom & Lab Infrastructure';
        routingReason = 'General estate maintenance team allocation.';
      }
    }

    // 2. Determine Priority & Urgency Score
    let priority: PriorityLevel = 'MEDIUM';
    let urgencyScore = 5;
    let priorityReason = 'Standard institutional resolution timeline applies.';
    const severitySignals: string[] = [];

    const criticalKeywords = ['emergency', 'fire', 'shock', 'electric', 'danger', 'hazard', 'harass', 'ragging', 'leak onto computer', 'blood', 'injury', 'urgent'];
    const highKeywords = ['cannot study', 'exam tomorrow', 'all students', 'whole floor', 'broken', 'downtime', 'not working', 'timeout', 'duplicate debit', 'money'];

    const hasCritical = criticalKeywords.some((k) => lower.includes(k));
    const hasHigh = highKeywords.some((k) => lower.includes(k));

    if (hasCritical || category === 'Campus Safety & Harassment') {
      priority = 'CRITICAL';
      urgencyScore = 9;
      priorityReason = 'Critical safety, electrical, or physical integrity hazard detected requiring under-12-hour resolution.';
      severitySignals.push('Life/Safety Hazard', 'Immediate Escalation Required', 'High Campus Impact');
    } else if (hasHigh || lower.length > 200) {
      priority = 'HIGH';
      urgencyScore = 7;
      priorityReason = 'Significant academic or residential disruption impacting student daily operations.';
      severitySignals.push('High Disruption', 'SLA Alert: 24h Window');
    } else {
      priority = 'MEDIUM';
      urgencyScore = 4;
      priorityReason = 'Routine maintenance or administrative request.';
      severitySignals.push('Standard Queue');
    }

    // 3. Sentiment Analysis
    let sentiment: AIAnalysisResult['sentiment'] = 'Neutral';
    if (lower.includes('terrible') || lower.includes('unacceptable') || lower.includes('disaster') || lower.includes('worst') || lower.includes('horrible')) {
      sentiment = 'Very Negative';
    } else if (lower.includes('frustrated') || lower.includes('again') || lower.includes('since yesterday') || lower.includes('no response') || lower.includes('refused')) {
      sentiment = 'Frustrated';
    } else if (lower.includes('please check') || lower.includes('kindly') || lower.includes('requesting')) {
      sentiment = 'Constructive';
    } else if (hasCritical) {
      sentiment = 'Very Negative';
    }

    // 4. Extracted Entities
    const extractedEntities: ExtractedEntity[] = [];
    if (location || locLower) {
      extractedEntities.push({
        label: 'Location',
        value: location || 'Campus Premises',
        category: 'location',
      });
    }

    // Regex extraction for lab/room/block numbers
    const roomMatch = text.match(/(?:room|lab|block|hall|floor|complex)\s+([A-Za-z0-9-]+)/i);
    if (roomMatch && !location?.toLowerCase().includes(roomMatch[0].toLowerCase())) {
      extractedEntities.push({
        label: 'Detected Area',
        value: roomMatch[0],
        category: 'location',
      });
    }

    const courseMatch = text.match(/[A-Z]{2,4}\s?[0-9]{3}/i);
    if (courseMatch) {
      extractedEntities.push({
        label: 'Course Reference',
        value: courseMatch[0].toUpperCase(),
        category: 'course',
      });
    }

    const amountMatch = text.match(/(?:inr|rs\.?|\$)\s?([0-9,]+)/i);
    if (amountMatch) {
      extractedEntities.push({
        label: 'Financial Amount',
        value: amountMatch[0],
        category: 'policy',
      });
    }

    // 5. Generate 1-sentence intelligent summary
    let summary = text.slice(0, 120);
    if (text.length > 120) {
      const firstPeriod = text.indexOf('.');
      if (firstPeriod > 20 && firstPeriod < 160) {
        summary = text.slice(0, firstPeriod + 1);
      } else {
        summary = `${text.slice(0, 115)}...`;
      }
    }
    summary = summary.replace(/\n/g, ' ').trim();

    // 6. Duplicate & Similarity Search
    const existingGrievances = storage.get<Grievance[]>('grievai_grievances', []);
    const similarGrievances: SimilarGrievance[] = [];

    const keywords = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3);

    existingGrievances.forEach((g) => {
      if (g.description === text) return; // skip exact self
      let matches = 0;
      keywords.forEach((k) => {
        if (g.description.toLowerCase().includes(k) || g.title.toLowerCase().includes(k)) {
          matches++;
        }
      });
      if (g.category === category) matches += 2;
      if (location && g.location.toLowerCase().includes(locLower)) matches += 3;

      const score = Math.min(Math.round((matches / (keywords.length + 3)) * 100), 96);
      if (score >= 40) {
        similarGrievances.push({
          id: g.id,
          title: g.title,
          category: g.category,
          status: g.status,
          similarityScore: score,
          submittedDate: g.createdAt.slice(0, 10),
          snippet: g.description.slice(0, 90) + '...',
        });
      }
    });

    similarGrievances.sort((a, b) => b.similarityScore - a.similarityScore);

    // 7. Calculate Confidence Score (typically 88% - 98%)
    const baseConf = 89 + (keywords.length % 9);
    const confidenceScore = Math.min(baseConf, 98);

    // 8. Suggested action
    const suggestedAction =
      priority === 'CRITICAL'
        ? `Issue immediate emergency work permit and dispatch duty engineer within 1 hour.`
        : priority === 'HIGH'
        ? `Assign duty supervisor and initiate triage investigation with 24h resolution SLA.`
        : `Queue for standard departmental review and student verification.`;

    return {
      summary,
      category,
      subcategory,
      confidenceScore,
      priority,
      priorityReason,
      urgencyScore,
      sentiment,
      recommendedDepartment,
      routingReason,
      extractedEntities,
      similarGrievances: similarGrievances.slice(0, 3),
      severitySignals,
      suggestedAction,
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Generate an official, context-aware AI response draft for the grievance authority.
   */
  public static generateOfficialDraft(grievance: Grievance, tone: 'Formal' | 'Empathetic' | 'Direct' = 'Formal'): string {
    const studentName = grievance.studentName.split(' ')[0] || 'Student';
    const caseId = grievance.id;
    const category = grievance.category;

    if (tone === 'Empathetic') {
      return `Dear ${studentName},\n\nThank you for bringing this matter to our attention regarding Case #${caseId}. We sincerely understand the frustration and inconvenience this situation has caused to your academic routine.\n\nOur team in the ${grievance.department} has thoroughly reviewed your report regarding "${grievance.title}". We have mobilized our on-site team to inspect the location (${grievance.location}) and initiate corrective measures immediately.\n\nWe anticipate this issue to be fully rectified by today. If you have any additional details or observe any further issues, please reply directly through this portal.\n\nSincerely,\nOffice of ${grievance.department}\nGrievance Resolution Board`;
    }

    if (tone === 'Direct') {
      return `Dear ${studentName},\n\nRe: Case #${caseId} - ${grievance.title}\n\nStatus Update: Your grievance has been reviewed and logged into the active work schedule for ${grievance.department}.\n\nAction Taken: Technical supervisor dispatched to ${grievance.location}. Work permit has been issued with target resolution by tomorrow.\n\nYou will receive a status notification once on-site verification is completed.\n\nRegards,\n${grievance.department}`;
    }

    // Default Formal Institutional Tone
    return `Dear ${studentName},\n\nWe acknowledge receipt of your formal grievance #${caseId} pertaining to ${category} at ${grievance.location}.\n\nIn accordance with institutional guidelines, our department has registered work order #WO-${caseId.replace(/[^0-9]/g, '') || '901'} to address the root cause of this issue. Relevant personnel have been instructed to conduct an immediate inspection and implement remedial actions under standard SLA protocols.\n\nWe remain committed to maintaining optimal institutional standards. Should you require further clarification, please post an update to your case file.\n\nRespectfully yours,\n${grievance.assignedAuthorityName || 'Grievance Authority'}\n${grievance.department}`;
  }
}
