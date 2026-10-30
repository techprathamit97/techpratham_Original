'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import PhoneInput from '@/components/common/PhoneInput/PhoneInput';
import { useMsg91Otp } from '@/components/common/Msg91Otp/useMsg91Otp';
import { getLeadSource } from '@/lib/leadSourceDetection';

/* ─── Types ─── */
interface Video {
  id: string;       // YouTube video id
  title: string;
  duration: string; // e.g. "18:24"
}
interface Category {
  key: string;      // tab label
  videos: Video[];
}

// TechPratham YouTube channel (used for the "View full program" link).
const CHANNEL_URL = 'https://www.youtube.com/@TechPrathamofficials/videos';

/* ─── Free tutorials, grouped by course (sourced from the real YouTube uploads) ─── */
const CATEGORIES: Category[] = [
  {
    key: 'Workday',
    videos: [
      { id: 'H-wcD8gT7sg', title: 'Workday Finance Full Course 2026 | Beginner to Advanced Tutorial', duration: '5:26:26' },
      { id: '20t8ARLZaao', title: 'Introduction to Workday HCM | Workday HCM Full Course Tutorial', duration: '3:23:31' },
      { id: '6fYQN6sURfU', title: 'Class 5 - Goal Workflow Troubleshooting | Workday Talent & Performance', duration: '49:34' },
      { id: 'rFIqocYfhzc', title: 'Class 4 - Business Process & Security Configuration | Workday Talent & Performance', duration: '1:01:48' },
      { id: 'CzgCwUR5lQg', title: 'Class 3 - Organization & Individual Goals | Workday Talent & Performance', duration: '1:06:12' },
      { id: 'gxek_vnRC9I', title: 'Class 2 - Goal Setup & Cascading Goals | Workday Talent & Performance', duration: '51:24' },
      { id: 'ZojtR9tanJw', title: 'Class 1 - Goal Setup & Configuration | Workday Talent & Performance', duration: '59:29' },
      { id: 'WyucKn3PyQU', title: 'Workday HCM Full Course | Workday HCM Training — Part 2', duration: '4:17:29' },
      { id: 'MTs_GA9vx20', title: 'Workday Adaptive Planning Tutorial for Beginners | Demo', duration: '43:35' },
      { id: '8G4e33HCIYo', title: 'Workday HCM Full Course | Workday HCM Training — Part 1', duration: '3:58:33' },
      { id: 'Y1RW25l7WOw', title: 'Workday Talent & Performance Management Full Course — Part 1', duration: '4:32:33' },
      { id: '5A0sK7ntxKQ', title: 'Workday Finance Full Course for Beginners — Part 2', duration: '5:37:26' },
      { id: 'eOtGCcGm4n0', title: 'Workday Finance Full Course for Beginners — Part 1', duration: '5:14:26' },
      { id: 'pIoQ9WyTOsY', title: 'Workday Fabric Explained | Architecture, Benefits & Real-World Use Cases', duration: '1:44:20' },
      { id: 'PIp97muyNbU', title: 'Workday Finance Full Course 2026 | Complete Financial Management Training', duration: '5:30:15' },
      { id: 'TXU7P2GWoj4', title: 'Workday Payroll Full Course 2026 | Beginner to Advanced Training', duration: '3:49:04' },
      { id: 'pROO6K9sFBw', title: 'Workday HCM Full Course | Workday HCM Tutorial 2026', duration: '4:05:28' },
      { id: '_oGSYj8JJsQ', title: 'Workday Prism & Accounting Center Explained | Real-Time Banking Use Case', duration: '4:37:41' },
      { id: '83KR0z4h5u4', title: 'Workday Integrations Full Course for Beginners', duration: '4:57:52' },
      { id: 'wUXUnA59PkU', title: 'Workday HCM | Location, Company, Cost Center & Supervisory Org — Class 6', duration: '49:26' },
      { id: '3PuL3FFK-eI', title: 'Workday HCM | Supervisory Org Inheritance & Subordinate Orgs — Class 7', duration: '56:55' },
      { id: 'u-sFpynXQv0', title: 'Workday HCM | Supervisory Org, Inheritance & Reorganization — Class 2', duration: '52:45' },
      { id: 'ZhmuiiR6yCQ', title: 'Workday HCM | Tenants Explained: Production, Sandbox & Security Roles — Class 3', duration: '32:34' },
      { id: 'UZL6V8i-Crw', title: 'Workday HCM for Beginners | Core HCM Overview & Implementation — Class 4', duration: '47:26' },
      { id: 'MQX0a9mpxRg', title: 'Workday Core HCM Training | Tenant Navigation & Organizations — Class 5', duration: '47:26' },
      { id: 'L8XLKjmZCRg', title: 'Workday Core HCM Training | HCM, ERP & SaaS Concepts Explained — Class 1', duration: '42:52' },
      { id: 'LgUDdpVQ0X8', title: 'Workday HR Administration | Jira Tickets, Stakeholders & Support — Class 3', duration: '22:30' },
      { id: 'IlM-A-0HIvs', title: 'Workday Full Course for Beginners', duration: '2:30:03' },
      { id: 'd_W9Mt3yFQw', title: 'Workday Recruiting | Job Requisition & Candidate Management — Class 13', duration: '52:20' },
      { id: 'OOVJCu3Be2A', title: 'Workday Recruiting | Job Profiles, Positions & Requisitions — Class 11', duration: '50:47' },
      { id: '2esW7mZ9qLI', title: 'Workday Recruiting | Job Profiles, Positions & Hiring Flow — Class 12', duration: '43:57' },
      { id: '4kIMne0Ah6Y', title: 'Workday HCM | Supervisory, Matrix & Custom Organization — Class 9', duration: '50:19' },
      { id: 'zf7XYiMfGew', title: 'Workday Staffing Models | Position Management vs Job Management — Class 10', duration: '29:31' },
      { id: 'def0XZAY4F8', title: 'Workday HCM | Create Company, Cost Center & Region — Class 8', duration: '1:02:52' },
      { id: 'JyD6Qz2WfNE', title: 'Workday HCM | Supervisory Organization & Staffing Models — Class 7', duration: '55:22' },
      { id: 'f_oE6Phvf_U', title: 'Workday HCM | Cost Center, Worktags, Region & Location — Class 6', duration: '24:10' },
      { id: 'f82KuzitQuQ', title: 'Workday HCM | Create Cost Center, Region & Location — Class 5', duration: '56:29' },
      { id: 'D13zVJqhEmE', title: 'Workday HCM Basics | ERP, Cloud, Tenants & Workday Overview — Class 2', duration: '1:06:22' },
      { id: 'q0tN0k6QN7s', title: 'Workday HCM | Create Company & Core HCM Organizations — Class 4', duration: '40:34' },
      { id: 'PPzRYboTTeU', title: 'Workday HCM Full Course Introduction | Modules Explained — Class 1', duration: '23:12' },
      { id: '3ctZjL-3EdI', title: 'Workday HCM Full Course | Core HCM, Organizations, Tenants & Work Tags', duration: '4:11:17' },
    ],
  },
  {
    key: 'ServiceNow',
    videos: [
      { id: 'qDRyXCDVAbY', title: 'ServiceNow Security Exposure Management | Qualys Integration, Risk Assessment & Remediation', duration: '1:51:41' },
      { id: 'sbEhGymh1_A', title: 'ServiceNow IT Asset Management | Hardware Asset Lifecycle & Stockrooms', duration: '1:04:23' },
      { id: '_yLKlWveoao', title: 'ServiceNow Software Asset Management (SAM) Full Course for Beginners', duration: '59:08' },
      { id: 'B8djWShsoso', title: 'Class 4 - Plugins, SDLC & User Stories | ServiceNow Testing Tutorial', duration: '1:23:33' },
      { id: '1V_KFEwRiT8', title: 'Class 3 - Users, Groups & Roles | ServiceNow Testing Tutorial', duration: '1:14:42' },
      { id: 'WuQmuprHYdo', title: 'Class 2 - Forms in ServiceNow | ServiceNow Testing Tutorial', duration: '2:47:13' },
      { id: 'x9Ml0XHe6NI', title: 'Class 1 - Impersonate User & User Table | ServiceNow Testing Tutorial', duration: '1:05:56' },
      { id: 'WD_AsOPVxxI', title: 'SDLC, STLC & Test Cases | ServiceNow Testing Full Course — Part 1', duration: '4:53:21' },
      { id: 'lV-7u0cSN-M', title: 'ServiceNow Business Rules & Server-Side Scripting | Developer Tutorial', duration: '28:40' },
      { id: 'bhCspOMOjt0', title: 'ServiceNow ITOM Introduction, Architecture & Use Cases | ITOM Tutorial', duration: '53:44' },
      { id: 'pzN0vK1Aacc', title: 'ServiceNow IT Asset Management (ITAM) Full Course — Part 1', duration: '4:07:16' },
      { id: 'rpDF40AyebY', title: 'Class 1 - Introduction & Basics | ServiceNow ITOM Complete Training 2026', duration: '1:14:57' },
      { id: '9lLK_Sn9jxI', title: 'ServiceNow ITOM Full Course | ITOM Training — Part 1', duration: '4:08:11' },
      { id: 'pZdKEXzaSLI', title: 'ServiceNow Business Analyst (BA) Full Course — Part 3', duration: '5:08:42' },
      { id: 'WfZj9T5-SWs', title: 'ServiceNow Admin & Developer Full Course | ITSM, Scripting & Development', duration: '1:46:01' },
      { id: 'kIrhaT4rNUo', title: 'ServiceNow Business Analyst (BA) Full Course — Part 2', duration: '4:50:53' },
      { id: 'isupSuOYMB8', title: 'ServiceNow Business Analyst (BA) Full Course — Part 1', duration: '5:41:34' },
      { id: 'rmTDC67TpcY', title: 'ServiceNow GRC/IRM Full Course for Beginners — Part 3', duration: '3:23:49' },
      { id: 'CZa4n8IY1lg', title: 'Database Views | getReference vs GlideAjax | SN Admin & Developer — Class 27', duration: '30:46' },
      { id: 'okqai222dCU', title: 'SSO Integration & Scripted SOAP API | SN Admin & Developer — Class 26', duration: '40:58' },
      { id: 'Z08kq09K5Kk', title: 'ServiceNow GRC/IRM Full Course | Policy, Risk Management & Audit — Part 2', duration: '4:21:00' },
      { id: 'AfOOq7Ykz3A', title: 'ServiceNow GRC/IRM Full Course | Fundamentals, Architecture & Controls — Part 1', duration: '3:52:59' },
      { id: 'YRQKt4QkGrw', title: 'Scripted REST API in ServiceNow | SN Admin & Developer — Class 25', duration: '55:18' },
      { id: 'M8JtbILKeDw', title: 'GlideAjax in ServiceNow | SN Admin & Developer — Class 24', duration: '48:01' },
      { id: 'rEQimD5ca0U', title: 'Query Business Rules in ServiceNow | SN Admin & Developer — Class 23', duration: '47:26' },
      { id: 'U6vJI00yRck', title: 'System Properties & UI Messages | SN Admin & Developer — Class 22', duration: '16:23' },
      { id: '825L0VLIcsM', title: 'SOAP Integration in ServiceNow | SOAP Message Tutorial — Class 21', duration: '1:23' },
      { id: 'Knbdo2vqWgs', title: 'REST Integration | REST API, JSON & Methods | SN Admin & Developer — Class 20', duration: '52:11' },
      { id: 'oBbFr_I8blI', title: 'ACL in ServiceNow | Access Control List & Security Rules — Class 19', duration: '50:08' },
      { id: 'FIz4vF_d_MU', title: 'Flow Designer in ServiceNow | Automation Tutorial — Class 18', duration: '1:01:11' },
      { id: 'XidUhVi5nj8', title: 'Script Includes in ServiceNow | SN Admin & Developer — Class 17', duration: '41:47' },
      { id: 'ItD6H4I7CXE', title: 'ServiceNow SLA Explained | SN Admin & Developer — Class 16', duration: '55:05' },
      { id: '0xVsO0qv4ws', title: 'GlideRecord CRUD | Insert, Update & Delete — Class 15', duration: '49:58' },
      { id: 'x0Ah0MrmLc4', title: 'Asset Management in ServiceNow | SN Admin & Developer — Class 14', duration: '1:13:48' },
      { id: 'HtSedMxna88', title: 'JavaScript Basics for ServiceNow | SN Admin & Developer — Class 13', duration: '1:02:51' },
      { id: 'CE2_gUCsFg8', title: 'Update Sets in ServiceNow | SN Admin & Developer — Class 12', duration: '59:07' },
      { id: 'PqipAoeT69Y', title: 'User Administration in ServiceNow | SN Admin & Developer — Class 11', duration: '36:38' },
      { id: 'd6HGn-1HwLw', title: 'Import Sets in ServiceNow | SN Admin & Developer — Class 10', duration: '43:29' },
      { id: 'l4cJ3gMo0oM', title: 'Client Scripts in ServiceNow | SN Admin & Developer — Class 9', duration: '51:25' },
      { id: '2LqI1LEiP2c', title: 'Service Catalog Management | SN Admin & Developer — Class 8', duration: '41:55' },
      { id: 'pHg994I1ePo', title: 'Incident Management in ServiceNow | SN Admin & Developer — Class 7', duration: '32:43' },
      { id: 'kejrEj4_nhI', title: 'ServiceNow Flow Designer | SN Admin & Developer — Class 6', duration: '1:34:09' },
      { id: 'mL4aWfYefZI', title: 'Update Sets & Related Lists | SN Admin & Developer — Class 5', duration: '1:00:19' },
      { id: 'gXu0EkNR3LE', title: 'ServiceNow Custom Tables | SN Admin & Developer — Class 4', duration: '49:08' },
      { id: 'CtR-pVHnBH4', title: 'Dashboards & Applications | SN Admin & Developer — Class 3', duration: '1:03:34' },
      { id: 'luvTGxobusg', title: 'Applications & Modules | SN Admin & Developer — Class 2', duration: '36:06' },
      { id: 'ekOoCXNJ74k', title: 'ServiceNow Architecture | SN Admin & Developer — Class 1', duration: '43:58' },
      { id: 'rTvb7BAcrao', title: 'ServiceNow Admin Interview Questions | SN Admin — Class 16', duration: '46:11' },
      { id: 'jVPvz7-dW5I', title: 'Dashboard in ServiceNow | SN Admin Tutorial — Class 15', duration: '50:26' },
      { id: 'PrN1xrRbG3U', title: 'REST Integration in ServiceNow | SN Admin Tutorial — Class 14', duration: '45:50' },
      { id: 'lBPz-GHRnY0', title: 'Record Producer in ServiceNow | SN Admin Tutorial — Class 13', duration: '45:57' },
      { id: 'Az3QuMYPYb4', title: 'Debug Flow Designer | SN Admin Tutorial — Class 12', duration: '47:44' },
      { id: '32apYKA5JpE', title: 'Flow Designer in ServiceNow | SN Admin Tutorial — Class 11', duration: '53:03' },
      { id: '0fDXrquMk2U', title: 'Asset Management in ServiceNow | SN Admin Tutorial — Class 10', duration: '53:08' },
      { id: '1yqHjpeWG5c', title: 'SLA in ServiceNow | SN Admin Tutorial — Class 9', duration: '59:40' },
      { id: 'Hmw4GpMyXq0', title: 'Data Lookup Tables | SN Admin Tutorial — Class 8', duration: '44:04' },
      { id: 'B_fI2T7zylY', title: 'Business Rules in ServiceNow | SN Admin Tutorial — Class 7', duration: '1:22:58' },
      { id: '12pFQQVb6wQ', title: 'GlideRecord in ServiceNow | SN Admin Tutorial — Class 6', duration: '1:01:14' },
      { id: 's0fUlVrF4rk', title: 'Client Scripts in ServiceNow | SN Admin Tutorial — Class 5', duration: '1:18:56' },
      { id: 'Cz4coGcy70Y', title: 'UI Policy in ServiceNow | SN Admin Tutorial — Class 4', duration: '41:23' },
      { id: 'rHzCq95chzM', title: 'Change Management in ServiceNow | SN Admin Tutorial — Class 3', duration: '1:12:24' },
      { id: 'gHhoGisfDak', title: 'Users, Groups & Roles | SN Admin Tutorial — Class 2', duration: '1:18:15' },
      { id: 'Kq-drnKvLUk', title: 'ITSM Basics in ServiceNow | SN Admin Tutorial — Class 1', duration: '1:05:38' },
      { id: '3vrtEzUYtZo', title: 'ServiceNow RSD Full Course for Beginners', duration: '1:44:54' },
      { id: '3K-b59OWaSs', title: 'ServiceNow Training — Class 5', duration: '1:18:01' },
      { id: '09XWE0J58uw', title: 'ServiceNow Training — Class 3', duration: '1:09:21' },
      { id: 'WhuqGH_ndI0', title: 'ServiceNow Training — Class 4', duration: '39:57' },
      { id: 'GG7r6tw3M4U', title: 'ServiceNow Training — Class 2', duration: '1:17:05' },
      { id: '-EF2bPTHjCo', title: 'ServiceNow Training — Class 1', duration: '58:11' },
      { id: 'Eqj4KWqtipI', title: 'ServiceNow Business Analyst (BA) Full Course | Beginner to Advanced', duration: '55:49' },
      { id: 'NPgCNlfLTxA', title: 'ServiceNow ITSM Full Course | Incident, Problem, Change & Request Management', duration: '2:15:18' },
      { id: 'CGI3CFxzLao', title: 'ServiceNow ITOM Full Course | Discovery, Service Mapping, Event Management & CMDB', duration: '2:00:27' },
      { id: 'aEZpIFSBbOM', title: 'ServiceNow for Beginners | Incident, Problem & Change Management', duration: '46:50' },
      { id: 'mA3rRR3wrDY', title: 'ServiceNow Full Course Beginner to Advanced — Class 3', duration: '43:12' },
      { id: 'V0A5W-y8vWY', title: 'Update Sets | Dictionary Override, Reference Qualifier & Related Lists — Class 5', duration: '49:59' },
      { id: 'o5FffObsqlA', title: 'Application Development | Create Custom Application & Tables — Class 4', duration: '42:49' },
      { id: 'E_snW3CLETM', title: 'What is ServiceNow? | Introduction, Architecture, ITIL & ITSM — Class 1', duration: '45:18' },
      { id: 'rCrehmDz-4A', title: 'ServiceNow Full Course 2026 | Complete Tutorial for Beginners', duration: '2:57:53' },
    ],
  },
  {
    key: 'SAP',
    videos: [
      { id: 'JXR92ApB_q0', title: 'SAP Ariba Training | Introduction to Spend Management & Procurement', duration: '42:21' },
      { id: 'VphsqFzDgzg', title: 'SAP Ariba Training | Spend Management & Procurement Process', duration: '45:46' },
      { id: 'gYrcZWOFWR4', title: 'Class 8 - Data Modeling, Objects & Relationships | SAP SuccessFactors EC', duration: '1:07:30' },
      { id: 'hyAJp9psPoE', title: 'Class 7 - Foundation Objects & MDF Objects | SAP SuccessFactors EC', duration: '42:53' },
      { id: 'L4o-St__b9o', title: 'Class 6 - Data Models & Configuration | SAP SuccessFactors EC', duration: '47:50' },
      { id: 'XdqWaBx5fXg', title: 'SAP SuccessFactors Employee Central Full Course — Part 2', duration: '5:30:45' },
      { id: 'tepj_8fKLR8', title: 'Class 5 - Sourcing Project & RFI/RFP Events | SAP Ariba Tutorial 2026', duration: '45:05' },
      { id: 'FRplyfPlLu4', title: 'Class 4 - Supplier Registration & Onboarding | SAP Ariba Tutorial 2026', duration: '46:45' },
      { id: 'UgPnz3is4vI', title: 'Class 3 - Supplier Lifecycle Management (SLP) | SAP Ariba Tutorial 2026', duration: '1:01:10' },
      { id: 'W0XAIajSJnE', title: 'Employee Profile & Data Models | SAP SuccessFactors EC — Class 5', duration: '50:59' },
      { id: 'kaA0DzEC-Pk', title: 'Class 2 - SAP S/4HANA Procurement & P2P Cycle | SAP Ariba Tutorial 2026', duration: '48:04' },
      { id: 'Tn8MPkTGAMc', title: 'Class 1 - SAP Ariba Introduction | SAP Ariba Tutorial 2026', duration: '46:04' },
      { id: '0vk8D3bj6L8', title: 'Provisioning System & RBP | SAP SuccessFactors EC — Class 4', duration: '1:04:00' },
      { id: '_WGyuWigFQg', title: 'SAP Ariba Full Course — Part 1 | Beginner to Advanced', duration: '4:19:48' },
      { id: 'OJWbDdC69hg', title: 'Manage Home Page & Theme Customization | SAP SuccessFactors EC — Class 3', duration: '51:36' },
      { id: 'iKRL2nl-SEw', title: 'Static & Dynamic Permission Groups | SAP SuccessFactors EC — Class 2', duration: '54:08' },
      { id: '18hniMJUQ9I', title: 'RBP & Permission Groups | SAP SuccessFactors EC — Class 1', duration: '51:41' },
      { id: '2Ly0RvOU1W8', title: 'SAP SuccessFactors Employee Central Full Course — Part 1', duration: '4:53:27' },
    ],
  },
  {
    key: 'Salesforce',
    videos: [
      { id: 'oLDhbzEwe34', title: 'Salesforce Administrator (Admin) Full Course — Part 1', duration: '5:22:09' },
      { id: 'LdfbY6Du87g', title: 'Salesforce Development Training | Apex, LWC, SOQL & CRM', duration: '5:01:55' },
      { id: 'AdaTkonErgU', title: 'CRM, Architecture, Apps & Admin Basics | Salesforce Admin Full Course — Part 1', duration: '5:29:52' },
      { id: 'LY2DGCNKFBQ', title: 'Salesforce Business Analyst (BA) Full Course — Part 1', duration: '4:48:18' },
      { id: 'aZB7DQRErbo', title: 'Salesforce QA & Testing Fundamentals | CRM Testing — Part 1', duration: '4:58:38' },
      { id: 'fpu6L6DtgLI', title: 'Salesforce Agentforce, AI Agents & Automation — Part 1', duration: '4:18:11' },
      { id: 'fepK_nczuqo', title: 'Salesforce Admin | Page Layouts, Record Types & Lightning Record Pages', duration: '1:28:40' },
      { id: 'QiQ1A3tTzFo', title: 'Salesforce Data Modeling | Objects, Fields & Relationships Explained', duration: '1:06:15' },
      { id: 'cZJB-lIv5lE', title: 'Salesforce Developer Full Course | Apex, LWC & Development — Class 3', duration: '1:02:10' },
      { id: 'f7qvszPQjpU', title: 'Salesforce Developer Full Course | Apex, LWC & Development — Class 2', duration: '39:03' },
      { id: 'X9RpjwpLWE0', title: 'Salesforce Developer Full Course | Apex, LWC & Development — Class 1', duration: '31:48' },
      { id: '-rx-jcRq6Jk', title: 'Salesforce Apex for Beginners | Operators, If-Else & Logical Operators', duration: '37:05' },
      { id: 'rnCHXmBj0_U', title: 'Salesforce Apex For Loop & For-Each Loop | Examples, Lists & Practice — Class 7', duration: '30:50' },
      { id: 'AgYMn46HpGU', title: 'Apex for Beginners | While Loop & Do-While Loop — Class 6', duration: '21:37' },
      { id: 'IhYlbZA0iaw', title: 'Salesforce Apex Loops | For Loop vs For-Each Loop with Examples', duration: '8:15' },
    ],
  },
  {
    key: 'Software Testing',
    videos: [
      { id: 'Su4Eu3cmQKE', title: 'Tricentis TOSCA Automation Full Course 2026 — Part 1', duration: '4:22:31' },
      { id: 'Q-Tx9O-Xuqw', title: 'Tosca Installation & Setup | Automation Tool Tutorial — Class 1', duration: '50:16' },
      { id: 'peBtb63AkCA', title: 'Test Case Design & Action Modes in Tosca — Class 2', duration: '49:07' },
      { id: 'WV3SWFuIVso', title: 'Tosca Action Modes & Buffer — Class 3', duration: '50:34' },
      { id: '0c2zR7maGgE', title: 'Math, Random & Date Functions in Tosca — Class 4', duration: '30:02' },
      { id: 'SysN0UV9nJk', title: 'Tosca Scanning Techniques & Web Tables — Class 5', duration: '1:00:06' },
      { id: 'KLGoJvjZYGs', title: 'Tosca Database Testing with MySQL & ODBC — Class 6', duration: '23:40' },
    ],
  },
  {
    key: 'AI',
    videos: [
      { id: 'CxlGPXQb1yQ', title: 'Python for Beginners | Strings, Lists, Dictionaries & Indexing Explained', duration: '4:16:59' },
      { id: 'p2vlT80HwJ4', title: 'Python for Beginners | Variables, Data Types & Strings with Examples', duration: '1:05:13' },
    ],
  },
  {
    key: 'Odoo',
    videos: [
      { id: 'JgInZjQOuds', title: 'Odoo Functional Full Course 2026 | Beginner to Advanced Odoo Tutorial', duration: '4:33:23' },
      { id: '52RD0bsy6oQ', title: 'Python for Beginners: Variables, Data Types & Strings | Class 1', duration: '1:05:13' },
    ],
  },
];

/* ─── Gated lead form modal — collects details, then plays the video ─── */
interface VideoModalProps {
  videoTitle: string;
  videoUrl: string;
  category: string;
  onClose: () => void;
}

function VideoLeadModal({ videoTitle, videoUrl, category, onClose }: VideoModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  /* ─── MSG91 OTP verification state ─── */
  const { ready: otpReady, sendOtp, verifyOtp, retryOtp } = useMsg91Otp();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  // The phone must be re-verified whenever it changes.
  const handlePhoneChange = (phone: string) => {
    setPhoneNumber(phone);
    if (otpSent || otpVerified) {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp('');
      setOtpError('');
    }
  };

  const handleSendOtp = async () => {
    if (!isPhoneValid) { setOtpError('Please enter a valid phone number first.'); return; }
    if (!otpReady) { setOtpError('OTP service is loading, please try again in a moment.'); return; }
    setOtpError('');
    setSendingOtp(true);
    try {
      // MSG91 expects the full number with country code and no "+" (e.g. 919876543210).
      await sendOtp(phoneNumber.replace(/\D/g, ''));
      setOtpSent(true);
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setOtpError('');
    setSendingOtp(true);
    try {
      await retryOtp();
      setOtp('');
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Failed to resend OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length < 6) { setOtpError('Please enter the 6-digit OTP.'); return; }
    setOtpError('');
    setVerifyingOtp(true);
    try {
      // 1) Verify the OTP with MSG91 (client) → returns a short-lived access token.
      //    A successful resolve here means MSG91 has accepted the OTP.
      const accessToken = await verifyOtp(otp.trim());

      // The phone is now genuinely verified against MSG91 — unlock submission.
      setOtpVerified(true);
      setOtpError('');

      // 2) Best-effort server-side confirmation using the secret Auth Key.
      //    We don't hard-block on this: if it fails (e.g. the Auth Key's IP
      //    allow-list doesn't include this server, or a transient network
      //    error), the OTP is still verified by MSG91 above. The failure is
      //    logged so it can be fixed without locking out real users.
      try {
        const resp = await fetch('/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken }),
        });
        const data = await resp.json().catch(() => null);
        if (!(resp.ok && data?.verified)) {
          console.warn('Server-side OTP confirmation did not pass:', data?.message);
        }
      } catch (e) {
        console.warn('Server-side OTP confirmation failed:', e);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      // MSG91 returns "OTP already verified" once a code has been accepted.
      // That means the number is verified, so treat it as success.
      if (/already\s*verif/i.test(msg)) {
        setOtpVerified(true);
        setOtpError('');
      } else {
        setOtpError(msg || 'Invalid OTP. Please try again.');
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPhoneValid) { setError('Please enter a valid phone number.'); return; }
    if (!otpVerified) { setError('Please verify your phone number with the OTP first.'); return; }
    if (!consent) { setError('Please accept the Terms & Conditions.'); return; }
    setError('');
    setSubmitting(true);

    // Open the video directly within the click gesture. Pointing the new tab
    // straight at the YouTube URL (instead of opening about:blank and
    // redirecting after the save) avoids the brief "about:blank" flash in the
    // address bar. The lead save runs in parallel below.
    window.open(videoUrl, '_blank', 'noopener,noreferrer');

    try {
      const source = getLeadSource();
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone: phoneNumber,
          email,
          course: `${category} - ${videoTitle}`,
          formType: 'free-tutorial',
          source,
          consent,
          phoneVerified: true,
        }),
      });

      if (resp.ok) {
        setSubmitSuccess(true);
        setTimeout(() => onClose(), 400);
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Watch Free Tutorial</h2>
            <p className="text-sm text-gray-500 mt-0.5">Enter your details to watch <strong>{videoTitle}</strong></p>
          </div>
          <button onClick={onClose} aria-label="Close"
                  className="p-1 rounded-full hover:bg-gray-100 transition flex-shrink-0 ml-4">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Full Name*"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full"
          />

          {/* Phone + OTP verification */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <PhoneInput
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  onValidationChange={setIsPhoneValid}
                  placeholder="Phone Number*"
                  required
                  size="md"
                  disableValidation
                />
              </div>
              {!otpSent && !otpVerified && (
                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!isPhoneValid || sendingOtp || !otpReady}
                  className="h-10 shrink-0 bg-gray-900 hover:bg-gray-800 text-white font-semibold px-4"
                >
                  {sendingOtp ? 'Sending…' : 'Send OTP'}
                </Button>
              )}
            </div>

            {/* OTP entry — shown after an OTP has been sent and until verified */}
            {otpSent && !otpVerified && (
              <div className="flex items-start gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="flex-1 tracking-[0.3em]"
                />
                <Button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || otp.length < 6}
                  className="h-10 shrink-0 bg-[#DA1E28] hover:bg-[#b5161f] text-white font-semibold px-4"
                >
                  {verifyingOtp ? 'Verifying…' : 'Verify'}
                </Button>
              </div>
            )}

            {otpSent && !otpVerified && (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={sendingOtp}
                className="self-start text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
              >
                Didn&apos;t get the code? Resend OTP
              </button>
            )}

            {otpVerified && (
              <p className="text-green-600 text-sm font-medium">✓ Phone number verified</p>
            )}

            {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
          </div>

          <Input
            type="email"
            placeholder="Email Address*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />

          <div className="flex items-start gap-2">
            <Checkbox
              id="free-tutorial-consent"
              checked={consent}
              onCheckedChange={(v) => setConsent(!!v)}
              required
              className="mt-0.5"
            />
            <label htmlFor="free-tutorial-consent" className="text-xs text-gray-600 leading-snug">
              By registering, I agree to TechPratham{' '}
              <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 underline">Terms & Conditions</a>.
            </label>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {submitSuccess ? (
            <p className="text-green-600 text-sm text-center font-medium">
              ✅ Submitted! Starting your video…
            </p>
          ) : (
            <Button
              type="submit"
              disabled={submitting || !isPhoneValid || !otpVerified}
              className="w-full bg-[#DA1E28] hover:bg-[#b5161f] text-white font-semibold h-10"
            >
              <FaYoutube className="w-4 h-4 mr-2" />
              {submitting
                ? 'Submitting…'
                : otpVerified
                  ? 'Watch now'
                  : 'Verify phone to watch'}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

/* ─── Single video card ─── */
function VideoCard({ video, onSelect }: { video: Video; onSelect: (v: Video) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(video)}
      className="group flex h-full w-full flex-col rounded-xl border border-gray-100 bg-white overflow-hidden text-left
                 transition-all duration-300 hover:shadow-lg hover:border-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DA1E28]/40"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-[#1e293b] overflow-hidden">
        <img
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          width={480}
          height={360}
          loading="lazy"
          decoding="async"
          // @ts-expect-error fetchpriority is a valid HTML attribute
          fetchpriority="low"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle dark overlay for play-button contrast */}
        <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10" />

        {/* Center play button */}
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center
                     rounded-full bg-[#DA1E28] shadow-lg transition-transform duration-300 group-hover:scale-110"
        >
          <Play className="h-5 w-5 fill-white text-white ml-0.5" />
        </span>

        {/* Duration badge */}
        {video.duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {video.duration}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-[15px] font-bold leading-snug text-gray-900 line-clamp-2">
          {video.title}
        </h4>
        <span className="mt-auto pt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#DA1E28]">
          Watch free on YouTube
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
  );
}

/* ─── Section ─── */
export default function FreeClass() {
  const [active, setActive] = useState(0);
  const current = CATEGORIES[active];

  // When set, the gated lead form modal is open for this video.
  const [pendingVideo, setPendingVideo] = useState<{ title: string; url: string; category: string } | null>(null);
  const openVideo = (v: Video) =>
    setPendingVideo({ title: v.title, url: `https://www.youtube.com/watch?v=${v.id}`, category: current.key });

  // Horizontal carousel: track whether we can scroll further left / right.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  // Recalculate (and reset scroll) whenever the active category changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ left: 0 });
    updateArrows();
  }, [active, updateArrows]);

  // Keep arrows in sync with viewport resizing.
  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [updateArrows]);

  // Scroll exactly one card (card width + gap) at a time.
  const scrollByDir = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    let step = el.clientWidth; // sensible fallback
    if (first) {
      const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0;
      step = first.offsetWidth + gap;
    }
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section className="w-full">
      {/* ── Red banner (heading + tabs) ── */}
      <div className="relative bg-[#FF2E41] py-2">
        <div className="max-w-7xl mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Free Tutorials Across All Courses
            </h2>
            
           
          </div>

          {/* Tabs */}
          <div className="mt-3 flex flex-wrap gap-2.5">
            {CATEGORIES.map((cat, i) => {
              const isActive = i === active;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none
                              focus-visible:ring-2 focus-visible:ring-white/70 ${
                    isActive
                      ? 'bg-white text-[#DA1E28] shadow-md'
                      : 'bg-white/10 text-white border border-white/25 hover:bg-white/20'
                  }`}
                >
                  {cat.key}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── White content card (overlaps the banner) ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="-mt-16 rounded-2xl bg-white shadow-xl border border-gray-100 p-5 md:p-7">
          {/* Card header */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">
              {current.key}
              <span className="ml-2 text-sm font-medium text-gray-400">
                · {current.videos.length} free videos
              </span>
            </h3>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 text-sm md:text-base font-bold text-[#DA1E28] whitespace-nowrap"
            >
              View full program
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Video carousel (horizontal scroll with left/right navigation) */}
          <div className="relative">
            {/* Left arrow */}
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              disabled={!canLeft}
              aria-label="Scroll left"
              className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-1/2 hidden md:flex h-10 w-10
                          items-center justify-center rounded-full bg-[#FF2E41] text-white shadow-lg border border-[#FF2E41]
                          transition-all duration-200 hover:bg-[#DA1E28] hover:border-[#DA1E28]
                          ${canLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Scroll row */}
            <div
              ref={scrollRef}
              onScroll={updateArrows}
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2
                         [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {current.videos.map((v) => (
                <div
                  key={v.id}
                  className="shrink-0 snap-start w-[82%] sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
                >
                  <VideoCard video={v} onSelect={openVideo} />
                </div>
              ))}
            </div>

            {/* Right arrow */}
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              disabled={!canRight}
              aria-label="Scroll right"
              className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-1/2 hidden md:flex h-10 w-10
                          items-center justify-center rounded-full bg-[#FF2E41] text-white shadow-lg border border-[#FF2E41]
                          transition-all duration-200 hover:bg-[#DA1E28] hover:border-[#DA1E28]
                          ${canRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Gated lead modal — opens when a video card is clicked ── */}
      {pendingVideo && (
        <VideoLeadModal
          videoTitle={pendingVideo.title}
          videoUrl={pendingVideo.url}
          category={pendingVideo.category}
          onClose={() => setPendingVideo(null)}
        />
      )}
    </section>
  );
}
