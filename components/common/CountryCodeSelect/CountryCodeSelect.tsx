import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './CountryCodeSelect.module.css';

// Country codes data with flag URLs
export const countryCodes = [
    { code: '+93', country: 'AF', flag: '🇦🇫', name: 'Afghanistan', shortName: 'AF', flagUrl: 'https://flagcdn.com/w20/af.png' },
    { code: '+355', country: 'AL', flag: '🇦🇱', name: 'Albania', shortName: 'AL', flagUrl: 'https://flagcdn.com/w20/al.png' },
    { code: '+213', country: 'DZ', flag: '🇩🇿', name: 'Algeria', shortName: 'DZ', flagUrl: 'https://flagcdn.com/w20/dz.png' },
    { code: '+376', country: 'AD', flag: '🇦🇩', name: 'Andorra', shortName: 'AD', flagUrl: 'https://flagcdn.com/w20/ad.png' },
    { code: '+244', country: 'AO', flag: '🇦🇴', name: 'Angola', shortName: 'AO', flagUrl: 'https://flagcdn.com/w20/ao.png' },
    { code: '+1-264', country: 'AI', flag: '🇦🇮', name: 'Anguilla', shortName: 'AI', flagUrl: 'https://flagcdn.com/w20/ai.png' },
    { code: '+1-268', country: 'AG', flag: '🇦🇬', name: 'Antigua and Barbuda', shortName: 'AG', flagUrl: 'https://flagcdn.com/w20/ag.png' },
    { code: '+54', country: 'AR', flag: '🇦🇷', name: 'Argentina', shortName: 'AR', flagUrl: 'https://flagcdn.com/w20/ar.png' },
    { code: '+374', country: 'AM', flag: '🇦🇲', name: 'Armenia', shortName: 'AM', flagUrl: 'https://flagcdn.com/w20/am.png' },
    { code: '+297', country: 'AW', flag: '🇦🇼', name: 'Aruba', shortName: 'AW', flagUrl: 'https://flagcdn.com/w20/aw.png' },
    { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia', shortName: 'AU', flagUrl: 'https://flagcdn.com/w20/au.png' },
    { code: '+43', country: 'AT', flag: '🇦🇹', name: 'Austria', shortName: 'AT', flagUrl: 'https://flagcdn.com/w20/at.png' },
    { code: '+994', country: 'AZ', flag: '🇦🇿', name: 'Azerbaijan', shortName: 'AZ', flagUrl: 'https://flagcdn.com/w20/az.png' },
    { code: '+1-242', country: 'BS', flag: '🇧🇸', name: 'Bahamas', shortName: 'BS', flagUrl: 'https://flagcdn.com/w20/bs.png' },
    { code: '+973', country: 'BH', flag: '🇧🇭', name: 'Bahrain', shortName: 'BH', flagUrl: 'https://flagcdn.com/w20/bh.png' },
    { code: '+880', country: 'BD', flag: '🇧🇩', name: 'Bangladesh', shortName: 'BD', flagUrl: 'https://flagcdn.com/w20/bd.png' },
    { code: '+1-246', country: 'BB', flag: '🇧🇧', name: 'Barbados', shortName: 'BB', flagUrl: 'https://flagcdn.com/w20/bb.png' },
    { code: '+375', country: 'BY', flag: '🇧🇾', name: 'Belarus', shortName: 'BY', flagUrl: 'https://flagcdn.com/w20/by.png' },
    { code: '+32', country: 'BE', flag: '🇧🇪', name: 'Belgium', shortName: 'BE', flagUrl: 'https://flagcdn.com/w20/be.png' },
    { code: '+501', country: 'BZ', flag: '🇧🇿', name: 'Belize', shortName: 'BZ', flagUrl: 'https://flagcdn.com/w20/bz.png' },
    { code: '+229', country: 'BJ', flag: '🇧🇯', name: 'Benin', shortName: 'BJ', flagUrl: 'https://flagcdn.com/w20/bj.png' },
    { code: '+1-441', country: 'BM', flag: '🇧🇲', name: 'Bermuda', shortName: 'BM', flagUrl: 'https://flagcdn.com/w20/bm.png' },
    { code: '+975', country: 'BT', flag: '🇧🇹', name: 'Bhutan', shortName: 'BT', flagUrl: 'https://flagcdn.com/w20/bt.png' },
    { code: '+591', country: 'BO', flag: '🇧🇴', name: 'Bolivia', shortName: 'BO', flagUrl: 'https://flagcdn.com/w20/bo.png' },
    { code: '+387', country: 'BA', flag: '🇧🇦', name: 'Bosnia and Herzegovina', shortName: 'BA', flagUrl: 'https://flagcdn.com/w20/ba.png' },
    { code: '+267', country: 'BW', flag: '🇧🇼', name: 'Botswana', shortName: 'BW', flagUrl: 'https://flagcdn.com/w20/bw.png' },
    { code: '+55', country: 'BR', flag: '🇧🇷', name: 'Brazil', shortName: 'BR', flagUrl: 'https://flagcdn.com/w20/br.png' },
    { code: '+673', country: 'BN', flag: '🇧🇳', name: 'Brunei', shortName: 'BN', flagUrl: 'https://flagcdn.com/w20/bn.png' },
    { code: '+359', country: 'BG', flag: '🇧🇬', name: 'Bulgaria', shortName: 'BG', flagUrl: 'https://flagcdn.com/w20/bg.png' },
    { code: '+226', country: 'BF', flag: '🇧🇫', name: 'Burkina Faso', shortName: 'BF', flagUrl: 'https://flagcdn.com/w20/bf.png' },
    { code: '+257', country: 'BI', flag: '🇧🇮', name: 'Burundi', shortName: 'BI', flagUrl: 'https://flagcdn.com/w20/bi.png' },
    { code: '+238', country: 'CV', flag: '🇨🇻', name: 'Cabo Verde', shortName: 'CV', flagUrl: 'https://flagcdn.com/w20/cv.png' },
    { code: '+855', country: 'KH', flag: '🇰🇭', name: 'Cambodia', shortName: 'KH', flagUrl: 'https://flagcdn.com/w20/kh.png' },
    { code: '+237', country: 'CM', flag: '🇨🇲', name: 'Cameroon', shortName: 'CM', flagUrl: 'https://flagcdn.com/w20/cm.png' },
    { code: '+1', country: 'CA', flag: '🇨🇦', name: 'Canada', shortName: 'CA', flagUrl: 'https://flagcdn.com/w20/ca.png' },
    { code: '+236', country: 'CF', flag: '🇨🇫', name: 'Central African Republic', shortName: 'CF', flagUrl: 'https://flagcdn.com/w20/cf.png' },
    { code: '+235', country: 'TD', flag: '🇹🇩', name: 'Chad', shortName: 'TD', flagUrl: 'https://flagcdn.com/w20/td.png' },
    { code: '+56', country: 'CL', flag: '🇨🇱', name: 'Chile', shortName: 'CL', flagUrl: 'https://flagcdn.com/w20/cl.png' },
    { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China', shortName: 'CN', flagUrl: 'https://flagcdn.com/w20/cn.png' },
    { code: '+57', country: 'CO', flag: '🇨🇴', name: 'Colombia', shortName: 'CO', flagUrl: 'https://flagcdn.com/w20/co.png' },
    { code: '+269', country: 'KM', flag: '🇰🇲', name: 'Comoros', shortName: 'KM', flagUrl: 'https://flagcdn.com/w20/km.png' },
    { code: '+242', country: 'CG', flag: '🇨🇬', name: 'Congo', shortName: 'CG', flagUrl: 'https://flagcdn.com/w20/cg.png' },
    { code: '+243', country: 'CD', flag: '🇨🇩', name: 'Congo (DRC)', shortName: 'CD', flagUrl: 'https://flagcdn.com/w20/cd.png' },
    { code: '+506', country: 'CR', flag: '🇨🇷', name: 'Costa Rica', shortName: 'CR', flagUrl: 'https://flagcdn.com/w20/cr.png' },
    { code: '+225', country: 'CI', flag: '🇨🇮', name: "Côte d'Ivoire", shortName: 'CI', flagUrl: 'https://flagcdn.com/w20/ci.png' },
    { code: '+385', country: 'HR', flag: '🇭🇷', name: 'Croatia', shortName: 'HR', flagUrl: 'https://flagcdn.com/w20/hr.png' },
    { code: '+53', country: 'CU', flag: '🇨🇺', name: 'Cuba', shortName: 'CU', flagUrl: 'https://flagcdn.com/w20/cu.png' },
    { code: '+357', country: 'CY', flag: '🇨🇾', name: 'Cyprus', shortName: 'CY', flagUrl: 'https://flagcdn.com/w20/cy.png' },
    { code: '+420', country: 'CZ', flag: '🇨🇿', name: 'Czechia', shortName: 'CZ', flagUrl: 'https://flagcdn.com/w20/cz.png' },
    { code: '+45', country: 'DK', flag: '🇩🇰', name: 'Denmark', shortName: 'DK', flagUrl: 'https://flagcdn.com/w20/dk.png' },
    { code: '+253', country: 'DJ', flag: '🇩🇯', name: 'Djibouti', shortName: 'DJ', flagUrl: 'https://flagcdn.com/w20/dj.png' },
    { code: '+1-767', country: 'DM', flag: '🇩🇲', name: 'Dominica', shortName: 'DM', flagUrl: 'https://flagcdn.com/w20/dm.png' },
    { code: '+1-809', country: 'DO', flag: '🇩🇴', name: 'Dominican Republic', shortName: 'DO', flagUrl: 'https://flagcdn.com/w20/do.png' },
    { code: '+593', country: 'EC', flag: '🇪🇨', name: 'Ecuador', shortName: 'EC', flagUrl: 'https://flagcdn.com/w20/ec.png' },
    { code: '+20', country: 'EG', flag: '🇪🇬', name: 'Egypt', shortName: 'EG', flagUrl: 'https://flagcdn.com/w20/eg.png' },
    { code: '+503', country: 'SV', flag: '🇸🇻', name: 'El Salvador', shortName: 'SV', flagUrl: 'https://flagcdn.com/w20/sv.png' },
    { code: '+240', country: 'GQ', flag: '🇬🇶', name: 'Equatorial Guinea', shortName: 'GQ', flagUrl: 'https://flagcdn.com/w20/gq.png' },
    { code: '+291', country: 'ER', flag: '🇪🇷', name: 'Eritrea', shortName: 'ER', flagUrl: 'https://flagcdn.com/w20/er.png' },
    { code: '+372', country: 'EE', flag: '🇪🇪', name: 'Estonia', shortName: 'EE', flagUrl: 'https://flagcdn.com/w20/ee.png' },
    { code: '+268', country: 'SZ', flag: '🇸🇿', name: 'Eswatini', shortName: 'SZ', flagUrl: 'https://flagcdn.com/w20/sz.png' },
    { code: '+251', country: 'ET', flag: '🇪🇹', name: 'Ethiopia', shortName: 'ET', flagUrl: 'https://flagcdn.com/w20/et.png' },
    { code: '+679', country: 'FJ', flag: '🇫🇯', name: 'Fiji', shortName: 'FJ', flagUrl: 'https://flagcdn.com/w20/fj.png' },
    { code: '+358', country: 'FI', flag: '🇫🇮', name: 'Finland', shortName: 'FI', flagUrl: 'https://flagcdn.com/w20/fi.png' },
    { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France', shortName: 'FR', flagUrl: 'https://flagcdn.com/w20/fr.png' },
    { code: '+241', country: 'GA', flag: '🇬🇦', name: 'Gabon', shortName: 'GA', flagUrl: 'https://flagcdn.com/w20/ga.png' },
    { code: '+220', country: 'GM', flag: '🇬🇲', name: 'Gambia', shortName: 'GM', flagUrl: 'https://flagcdn.com/w20/gm.png' },
    { code: '+995', country: 'GE', flag: '🇬🇪', name: 'Georgia', shortName: 'GE', flagUrl: 'https://flagcdn.com/w20/ge.png' },
    { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany', shortName: 'DE', flagUrl: 'https://flagcdn.com/w20/de.png' },
    { code: '+233', country: 'GH', flag: '🇬🇭', name: 'Ghana', shortName: 'GH', flagUrl: 'https://flagcdn.com/w20/gh.png' },
    { code: '+30', country: 'GR', flag: '🇬🇷', name: 'Greece', shortName: 'GR', flagUrl: 'https://flagcdn.com/w20/gr.png' },
    { code: '+1-473', country: 'GD', flag: '🇬🇩', name: 'Grenada', shortName: 'GD', flagUrl: 'https://flagcdn.com/w20/gd.png' },
    { code: '+502', country: 'GT', flag: '🇬🇹', name: 'Guatemala', shortName: 'GT', flagUrl: 'https://flagcdn.com/w20/gt.png' },
    { code: '+224', country: 'GN', flag: '🇬🇳', name: 'Guinea', shortName: 'GN', flagUrl: 'https://flagcdn.com/w20/gn.png' },
    { code: '+245', country: 'GW', flag: '🇬🇼', name: 'Guinea-Bissau', shortName: 'GW', flagUrl: 'https://flagcdn.com/w20/gw.png' },
    { code: '+592', country: 'GY', flag: '🇬🇾', name: 'Guyana', shortName: 'GY', flagUrl: 'https://flagcdn.com/w20/gy.png' },
    { code: '+509', country: 'HT', flag: '🇭🇹', name: 'Haiti', shortName: 'HT', flagUrl: 'https://flagcdn.com/w20/ht.png' },
    { code: '+504', country: 'HN', flag: '🇭🇳', name: 'Honduras', shortName: 'HN', flagUrl: 'https://flagcdn.com/w20/hn.png' },
    { code: '+852', country: 'HK', flag: '🇭🇰', name: 'Hong Kong', shortName: 'HK', flagUrl: 'https://flagcdn.com/w20/hk.png' },
    { code: '+36', country: 'HU', flag: '🇭🇺', name: 'Hungary', shortName: 'HU', flagUrl: 'https://flagcdn.com/w20/hu.png' },
    { code: '+354', country: 'IS', flag: '🇮🇸', name: 'Iceland', shortName: 'IS', flagUrl: 'https://flagcdn.com/w20/is.png' },
    { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India', shortName: 'IN', flagUrl: 'https://flagcdn.com/w20/in.png' },
    { code: '+62', country: 'ID', flag: '🇮🇩', name: 'Indonesia', shortName: 'ID', flagUrl: 'https://flagcdn.com/w20/id.png' },
    { code: '+98', country: 'IR', flag: '🇮🇷', name: 'Iran', shortName: 'IR', flagUrl: 'https://flagcdn.com/w20/ir.png' },
    { code: '+964', country: 'IQ', flag: '🇮🇶', name: 'Iraq', shortName: 'IQ', flagUrl: 'https://flagcdn.com/w20/iq.png' },
    { code: '+353', country: 'IE', flag: '🇮🇪', name: 'Ireland', shortName: 'IE', flagUrl: 'https://flagcdn.com/w20/ie.png' },
    { code: '+972', country: 'IL', flag: '🇮🇱', name: 'Israel', shortName: 'IL', flagUrl: 'https://flagcdn.com/w20/il.png' },
    { code: '+39', country: 'IT', flag: '🇮🇹', name: 'Italy', shortName: 'IT', flagUrl: 'https://flagcdn.com/w20/it.png' },
    { code: '+1-876', country: 'JM', flag: '🇯🇲', name: 'Jamaica', shortName: 'JM', flagUrl: 'https://flagcdn.com/w20/jm.png' },
    { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan', shortName: 'JP', flagUrl: 'https://flagcdn.com/w20/jp.png' },
    { code: '+962', country: 'JO', flag: '🇯🇴', name: 'Jordan', shortName: 'JO', flagUrl: 'https://flagcdn.com/w20/jo.png' },
    { code: '+7', country: 'KZ', flag: '🇰🇿', name: 'Kazakhstan', shortName: 'KZ', flagUrl: 'https://flagcdn.com/w20/kz.png' },
    { code: '+254', country: 'KE', flag: '🇰🇪', name: 'Kenya', shortName: 'KE', flagUrl: 'https://flagcdn.com/w20/ke.png' },
    { code: '+686', country: 'KI', flag: '🇰🇮', name: 'Kiribati', shortName: 'KI', flagUrl: 'https://flagcdn.com/w20/ki.png' },
    { code: '+965', country: 'KW', flag: '🇰🇼', name: 'Kuwait', shortName: 'KW', flagUrl: 'https://flagcdn.com/w20/kw.png' },
    { code: '+996', country: 'KG', flag: '🇰🇬', name: 'Kyrgyzstan', shortName: 'KG', flagUrl: 'https://flagcdn.com/w20/kg.png' },
    { code: '+856', country: 'LA', flag: '🇱🇦', name: 'Laos', shortName: 'LA', flagUrl: 'https://flagcdn.com/w20/la.png' },
    { code: '+371', country: 'LV', flag: '🇱🇻', name: 'Latvia', shortName: 'LV', flagUrl: 'https://flagcdn.com/w20/lv.png' },
    { code: '+961', country: 'LB', flag: '🇱🇧', name: 'Lebanon', shortName: 'LB', flagUrl: 'https://flagcdn.com/w20/lb.png' },
    { code: '+266', country: 'LS', flag: '🇱🇸', name: 'Lesotho', shortName: 'LS', flagUrl: 'https://flagcdn.com/w20/ls.png' },
    { code: '+231', country: 'LR', flag: '🇱🇷', name: 'Liberia', shortName: 'LR', flagUrl: 'https://flagcdn.com/w20/lr.png' },
    { code: '+218', country: 'LY', flag: '🇱🇾', name: 'Libya', shortName: 'LY', flagUrl: 'https://flagcdn.com/w20/ly.png' },
    { code: '+423', country: 'LI', flag: '🇱🇮', name: 'Liechtenstein', shortName: 'LI', flagUrl: 'https://flagcdn.com/w20/li.png' },
    { code: '+370', country: 'LT', flag: '🇱🇹', name: 'Lithuania', shortName: 'LT', flagUrl: 'https://flagcdn.com/w20/lt.png' },
    { code: '+352', country: 'LU', flag: '🇱🇺', name: 'Luxembourg', shortName: 'LU', flagUrl: 'https://flagcdn.com/w20/lu.png' },
    { code: '+853', country: 'MO', flag: '🇲🇴', name: 'Macau', shortName: 'MO', flagUrl: 'https://flagcdn.com/w20/mo.png' },
    { code: '+389', country: 'MK', flag: '🇲🇰', name: 'North Macedonia', shortName: 'MK', flagUrl: 'https://flagcdn.com/w20/mk.png' },
    { code: '+261', country: 'MG', flag: '🇲🇬', name: 'Madagascar', shortName: 'MG', flagUrl: 'https://flagcdn.com/w20/mg.png' },
    { code: '+265', country: 'MW', flag: '🇲🇼', name: 'Malawi', shortName: 'MW', flagUrl: 'https://flagcdn.com/w20/mw.png' },
    { code: '+60', country: 'MY', flag: '🇲🇾', name: 'Malaysia', shortName: 'MY', flagUrl: 'https://flagcdn.com/w20/my.png' },
    { code: '+960', country: 'MV', flag: '🇲🇻', name: 'Maldives', shortName: 'MV', flagUrl: 'https://flagcdn.com/w20/mv.png' },
    { code: '+223', country: 'ML', flag: '🇲🇱', name: 'Mali', shortName: 'ML', flagUrl: 'https://flagcdn.com/w20/ml.png' },
    { code: '+356', country: 'MT', flag: '🇲🇹', name: 'Malta', shortName: 'MT', flagUrl: 'https://flagcdn.com/w20/mt.png' },
    { code: '+692', country: 'MH', flag: '🇲🇭', name: 'Marshall Islands', shortName: 'MH', flagUrl: 'https://flagcdn.com/w20/mh.png' },
    { code: '+222', country: 'MR', flag: '🇲🇷', name: 'Mauritania', shortName: 'MR', flagUrl: 'https://flagcdn.com/w20/mr.png' },
    { code: '+230', country: 'MU', flag: '🇲🇺', name: 'Mauritius', shortName: 'MU', flagUrl: 'https://flagcdn.com/w20/mu.png' },
    { code: '+52', country: 'MX', flag: '🇲🇽', name: 'Mexico', shortName: 'MX', flagUrl: 'https://flagcdn.com/w20/mx.png' },
    { code: '+691', country: 'FM', flag: '🇫🇲', name: 'Micronesia', shortName: 'FM', flagUrl: 'https://flagcdn.com/w20/fm.png' },
    { code: '+373', country: 'MD', flag: '🇲🇩', name: 'Moldova', shortName: 'MD', flagUrl: 'https://flagcdn.com/w20/md.png' },
    { code: '+377', country: 'MC', flag: '🇲🇨', name: 'Monaco', shortName: 'MC', flagUrl: 'https://flagcdn.com/w20/mc.png' },
    { code: '+976', country: 'MN', flag: '🇲🇳', name: 'Mongolia', shortName: 'MN', flagUrl: 'https://flagcdn.com/w20/mn.png' },
    { code: '+382', country: 'ME', flag: '🇲🇪', name: 'Montenegro', shortName: 'ME', flagUrl: 'https://flagcdn.com/w20/me.png' },
    { code: '+212', country: 'MA', flag: '🇲🇦', name: 'Morocco', shortName: 'MA', flagUrl: 'https://flagcdn.com/w20/ma.png' },
    { code: '+258', country: 'MZ', flag: '🇲🇿', name: 'Mozambique', shortName: 'MZ', flagUrl: 'https://flagcdn.com/w20/mz.png' },
    { code: '+95', country: 'MM', flag: '🇲🇲', name: 'Myanmar', shortName: 'MM', flagUrl: 'https://flagcdn.com/w20/mm.png' },
    { code: '+264', country: 'NA', flag: '🇳🇦', name: 'Namibia', shortName: 'NA', flagUrl: 'https://flagcdn.com/w20/na.png' },
    { code: '+674', country: 'NR', flag: '🇳🇷', name: 'Nauru', shortName: 'NR', flagUrl: 'https://flagcdn.com/w20/nr.png' },
    { code: '+977', country: 'NP', flag: '🇳🇵', name: 'Nepal', shortName: 'NP', flagUrl: 'https://flagcdn.com/w20/np.png' },
    { code: '+31', country: 'NL', flag: '🇳🇱', name: 'Netherlands', shortName: 'NL', flagUrl: 'https://flagcdn.com/w20/nl.png' },
    { code: '+64', country: 'NZ', flag: '🇳🇿', name: 'New Zealand', shortName: 'NZ', flagUrl: 'https://flagcdn.com/w20/nz.png' },
    { code: '+505', country: 'NI', flag: '🇳🇮', name: 'Nicaragua', shortName: 'NI', flagUrl: 'https://flagcdn.com/w20/ni.png' },
    { code: '+227', country: 'NE', flag: '🇳🇪', name: 'Niger', shortName: 'NE', flagUrl: 'https://flagcdn.com/w20/ne.png' },
    { code: '+234', country: 'NG', flag: '🇳🇬', name: 'Nigeria', shortName: 'NG', flagUrl: 'https://flagcdn.com/w20/ng.png' },
    { code: '+850', country: 'KP', flag: '🇰🇵', name: 'North Korea', shortName: 'KP', flagUrl: 'https://flagcdn.com/w20/kp.png' },
    { code: '+47', country: 'NO', flag: '🇳🇴', name: 'Norway', shortName: 'NO', flagUrl: 'https://flagcdn.com/w20/no.png' },
    { code: '+968', country: 'OM', flag: '🇴🇲', name: 'Oman', shortName: 'OM', flagUrl: 'https://flagcdn.com/w20/om.png' },
    { code: '+92', country: 'PK', flag: '🇵🇰', name: 'Pakistan', shortName: 'PK', flagUrl: 'https://flagcdn.com/w20/pk.png' },
    { code: '+680', country: 'PW', flag: '🇵🇼', name: 'Palau', shortName: 'PW', flagUrl: 'https://flagcdn.com/w20/pw.png' },
    { code: '+970', country: 'PS', flag: '🇵🇸', name: 'Palestine', shortName: 'PS', flagUrl: 'https://flagcdn.com/w20/ps.png' },
    { code: '+507', country: 'PA', flag: '🇵🇦', name: 'Panama', shortName: 'PA', flagUrl: 'https://flagcdn.com/w20/pa.png' },
    { code: '+675', country: 'PG', flag: '🇵🇬', name: 'Papua New Guinea', shortName: 'PG', flagUrl: 'https://flagcdn.com/w20/pg.png' },
    { code: '+595', country: 'PY', flag: '🇵🇾', name: 'Paraguay', shortName: 'PY', flagUrl: 'https://flagcdn.com/w20/py.png' },
    { code: '+51', country: 'PE', flag: '🇵🇪', name: 'Peru', shortName: 'PE', flagUrl: 'https://flagcdn.com/w20/pe.png' },
    { code: '+63', country: 'PH', flag: '🇵🇭', name: 'Philippines', shortName: 'PH', flagUrl: 'https://flagcdn.com/w20/ph.png' },
    { code: '+48', country: 'PL', flag: '🇵🇱', name: 'Poland', shortName: 'PL', flagUrl: 'https://flagcdn.com/w20/pl.png' },
    { code: '+351', country: 'PT', flag: '🇵🇹', name: 'Portugal', shortName: 'PT', flagUrl: 'https://flagcdn.com/w20/pt.png' },
    { code: '+974', country: 'QA', flag: '🇶🇦', name: 'Qatar', shortName: 'QA', flagUrl: 'https://flagcdn.com/w20/qa.png' },
    { code: '+40', country: 'RO', flag: '🇷🇴', name: 'Romania', shortName: 'RO', flagUrl: 'https://flagcdn.com/w20/ro.png' },
    { code: '+7', country: 'RU', flag: '🇷🇺', name: 'Russia', shortName: 'RU', flagUrl: 'https://flagcdn.com/w20/ru.png' },
    { code: '+250', country: 'RW', flag: '🇷🇼', name: 'Rwanda', shortName: 'RW', flagUrl: 'https://flagcdn.com/w20/rw.png' },
    { code: '+1-869', country: 'KN', flag: '🇰🇳', name: 'Saint Kitts and Nevis', shortName: 'KN', flagUrl: 'https://flagcdn.com/w20/kn.png' },
    { code: '+1-758', country: 'LC', flag: '🇱🇨', name: 'Saint Lucia', shortName: 'LC', flagUrl: 'https://flagcdn.com/w20/lc.png' },
    { code: '+1-784', country: 'VC', flag: '🇻🇨', name: 'Saint Vincent', shortName: 'VC', flagUrl: 'https://flagcdn.com/w20/vc.png' },
    { code: '+685', country: 'WS', flag: '🇼🇸', name: 'Samoa', shortName: 'WS', flagUrl: 'https://flagcdn.com/w20/ws.png' },
    { code: '+378', country: 'SM', flag: '🇸🇲', name: 'San Marino', shortName: 'SM', flagUrl: 'https://flagcdn.com/w20/sm.png' },
    { code: '+239', country: 'ST', flag: '🇸🇹', name: 'Sao Tome and Principe', shortName: 'ST', flagUrl: 'https://flagcdn.com/w20/st.png' },
    { code: '+966', country: 'SA', flag: '🇸🇦', name: 'Saudi Arabia', shortName: 'SA', flagUrl: 'https://flagcdn.com/w20/sa.png' },
    { code: '+221', country: 'SN', flag: '🇸🇳', name: 'Senegal', shortName: 'SN', flagUrl: 'https://flagcdn.com/w20/sn.png' },
    { code: '+381', country: 'RS', flag: '🇷🇸', name: 'Serbia', shortName: 'RS', flagUrl: 'https://flagcdn.com/w20/rs.png' },
    { code: '+248', country: 'SC', flag: '🇸🇨', name: 'Seychelles', shortName: 'SC', flagUrl: 'https://flagcdn.com/w20/sc.png' },
    { code: '+232', country: 'SL', flag: '🇸🇱', name: 'Sierra Leone', shortName: 'SL', flagUrl: 'https://flagcdn.com/w20/sl.png' },
    { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore', shortName: 'SG', flagUrl: 'https://flagcdn.com/w20/sg.png' },
    { code: '+421', country: 'SK', flag: '🇸🇰', name: 'Slovakia', shortName: 'SK', flagUrl: 'https://flagcdn.com/w20/sk.png' },
    { code: '+386', country: 'SI', flag: '🇸🇮', name: 'Slovenia', shortName: 'SI', flagUrl: 'https://flagcdn.com/w20/si.png' },
    { code: '+677', country: 'SB', flag: '🇸🇧', name: 'Solomon Islands', shortName: 'SB', flagUrl: 'https://flagcdn.com/w20/sb.png' },
    { code: '+252', country: 'SO', flag: '🇸🇴', name: 'Somalia', shortName: 'SO', flagUrl: 'https://flagcdn.com/w20/so.png' },
    { code: '+27', country: 'ZA', flag: '🇿🇦', name: 'South Africa', shortName: 'ZA', flagUrl: 'https://flagcdn.com/w20/za.png' },
    { code: '+82', country: 'KR', flag: '🇰🇷', name: 'South Korea', shortName: 'KR', flagUrl: 'https://flagcdn.com/w20/kr.png' },
    { code: '+211', country: 'SS', flag: '🇸🇸', name: 'South Sudan', shortName: 'SS', flagUrl: 'https://flagcdn.com/w20/ss.png' },
    { code: '+34', country: 'ES', flag: '🇪🇸', name: 'Spain', shortName: 'ES', flagUrl: 'https://flagcdn.com/w20/es.png' },
    { code: '+94', country: 'LK', flag: '🇱🇰', name: 'Sri Lanka', shortName: 'LK', flagUrl: 'https://flagcdn.com/w20/lk.png' },
    { code: '+249', country: 'SD', flag: '🇸🇩', name: 'Sudan', shortName: 'SD', flagUrl: 'https://flagcdn.com/w20/sd.png' },
    { code: '+597', country: 'SR', flag: '🇸🇷', name: 'Suriname', shortName: 'SR', flagUrl: 'https://flagcdn.com/w20/sr.png' },
    { code: '+46', country: 'SE', flag: '🇸🇪', name: 'Sweden', shortName: 'SE', flagUrl: 'https://flagcdn.com/w20/se.png' },
    { code: '+41', country: 'CH', flag: '🇨🇭', name: 'Switzerland', shortName: 'CH', flagUrl: 'https://flagcdn.com/w20/ch.png' },
    { code: '+963', country: 'SY', flag: '🇸🇾', name: 'Syria', shortName: 'SY', flagUrl: 'https://flagcdn.com/w20/sy.png' },
    { code: '+886', country: 'TW', flag: '🇹🇼', name: 'Taiwan', shortName: 'TW', flagUrl: 'https://flagcdn.com/w20/tw.png' },
    { code: '+992', country: 'TJ', flag: '🇹🇯', name: 'Tajikistan', shortName: 'TJ', flagUrl: 'https://flagcdn.com/w20/tj.png' },
    { code: '+255', country: 'TZ', flag: '🇹🇿', name: 'Tanzania', shortName: 'TZ', flagUrl: 'https://flagcdn.com/w20/tz.png' },
    { code: '+66', country: 'TH', flag: '🇹🇭', name: 'Thailand', shortName: 'TH', flagUrl: 'https://flagcdn.com/w20/th.png' },
    { code: '+670', country: 'TL', flag: '🇹🇱', name: 'Timor-Leste', shortName: 'TL', flagUrl: 'https://flagcdn.com/w20/tl.png' },
    { code: '+228', country: 'TG', flag: '🇹🇬', name: 'Togo', shortName: 'TG', flagUrl: 'https://flagcdn.com/w20/tg.png' },
    { code: '+676', country: 'TO', flag: '🇹🇴', name: 'Tonga', shortName: 'TO', flagUrl: 'https://flagcdn.com/w20/to.png' },
    { code: '+1-868', country: 'TT', flag: '🇹🇹', name: 'Trinidad and Tobago', shortName: 'TT', flagUrl: 'https://flagcdn.com/w20/tt.png' },
    { code: '+216', country: 'TN', flag: '🇹🇳', name: 'Tunisia', shortName: 'TN', flagUrl: 'https://flagcdn.com/w20/tn.png' },
    { code: '+90', country: 'TR', flag: '🇹🇷', name: 'Turkey', shortName: 'TR', flagUrl: 'https://flagcdn.com/w20/tr.png' },
    { code: '+993', country: 'TM', flag: '🇹🇲', name: 'Turkmenistan', shortName: 'TM', flagUrl: 'https://flagcdn.com/w20/tm.png' },
    { code: '+688', country: 'TV', flag: '🇹🇻', name: 'Tuvalu', shortName: 'TV', flagUrl: 'https://flagcdn.com/w20/tv.png' },
    { code: '+256', country: 'UG', flag: '🇺🇬', name: 'Uganda', shortName: 'UG', flagUrl: 'https://flagcdn.com/w20/ug.png' },
    { code: '+380', country: 'UA', flag: '🇺🇦', name: 'Ukraine', shortName: 'UA', flagUrl: 'https://flagcdn.com/w20/ua.png' },
    { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE', shortName: 'AE', flagUrl: 'https://flagcdn.com/w20/ae.png' },
    { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom', shortName: 'GB', flagUrl: 'https://flagcdn.com/w20/gb.png' },
    { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States', shortName: 'US', flagUrl: 'https://flagcdn.com/w20/us.png' },
    { code: '+598', country: 'UY', flag: '🇺🇾', name: 'Uruguay', shortName: 'UY', flagUrl: 'https://flagcdn.com/w20/uy.png' },
    { code: '+998', country: 'UZ', flag: '🇺🇿', name: 'Uzbekistan', shortName: 'UZ', flagUrl: 'https://flagcdn.com/w20/uz.png' },
    { code: '+678', country: 'VU', flag: '🇻🇺', name: 'Vanuatu', shortName: 'VU', flagUrl: 'https://flagcdn.com/w20/vu.png' },
    { code: '+379', country: 'VA', flag: '🇻🇦', name: 'Vatican City', shortName: 'VA', flagUrl: 'https://flagcdn.com/w20/va.png' },
    { code: '+58', country: 'VE', flag: '🇻🇪', name: 'Venezuela', shortName: 'VE', flagUrl: 'https://flagcdn.com/w20/ve.png' },
    { code: '+84', country: 'VN', flag: '🇻🇳', name: 'Vietnam', shortName: 'VN', flagUrl: 'https://flagcdn.com/w20/vn.png' },
    { code: '+967', country: 'YE', flag: '🇾🇪', name: 'Yemen', shortName: 'YE', flagUrl: 'https://flagcdn.com/w20/ye.png' },
    { code: '+260', country: 'ZM', flag: '🇿🇲', name: 'Zambia', shortName: 'ZM', flagUrl: 'https://flagcdn.com/w20/zm.png' },
    { code: '+263', country: 'ZW', flag: '🇿🇼', name: 'Zimbabwe', shortName: 'ZW', flagUrl: 'https://flagcdn.com/w20/zw.png' }
];

interface CountryCodeSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({ 
    value, 
    onValueChange, 
    className = '',
    size = 'md'
}) => {
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const sizeClasses = {
        sm: 'w-20 p-1 h-8 text-xs',
        md: 'w-24 p-2 h-10',
        lg: 'w-28 p-3 h-12'
    };

    const flagSizes = {
        sm: { width: 16, height: 12 },
        md: { width: 20, height: 15 },
        lg: { width: 24, height: 18 }
    };

    // Filter countries based on search term
    const filteredCountries = useMemo(() => {
        if (!searchTerm) return countryCodes;
        
        return countryCodes.filter(country => 
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.code.includes(searchTerm) ||
            country.shortName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Find the selected country to display flag and code
    const selectedCountry = countryCodes.find(country => country.code === value);

    const handleValueChange = (newValue: string) => {
        onValueChange(newValue);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            setSearchTerm('');
        } else {
            // Focus the search input when dropdown opens
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        }
    };

    // Keep focus on search input and prevent dropdown from closing
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            const input = searchInputRef.current;
            input.focus();
            
            // Prevent the input from losing focus
            const handleBlur = (e: FocusEvent) => {
                // Only prevent blur if the new focus target is not within the dropdown
                const relatedTarget = e.relatedTarget as HTMLElement;
                if (!relatedTarget || !relatedTarget.closest('[data-radix-select-content]')) {
                    setTimeout(() => {
                        if (isOpen && input) {
                            input.focus();
                        }
                    }, 10);
                }
            };
            
            input.addEventListener('blur', handleBlur);
            return () => {
                input.removeEventListener('blur', handleBlur);
            };
        }
    }, [isOpen]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // Keep focus on input after state change
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 0);
    };

    const handleImageError = (countryCode: string) => {
        setImageErrors(prev => new Set([...prev, countryCode]));
    };

    const FlagDisplay = ({ country, size: flagSize }: { country: any, size: 'sm' | 'md' | 'lg' }) => {
        const hasError = imageErrors.has(country.code);
        
        if (hasError) {
            // Fallback to emoji flag if image fails to load
            return (
                <span className={`text-sm ${styles.flagEmoji || 'flag-emoji'}`}>
                    {country.flag}
                </span>
            );
        }

        return (
            <Image
                src={country.flagUrl}
                alt={`${country.name} flag`}
                width={flagSizes[flagSize].width}
                height={flagSizes[flagSize].height}
                className="object-cover rounded-sm border border-gray-200"
                onError={() => handleImageError(country.code)}
                unoptimized // For external CDN images
            />
        );
    };

    return (
        <Select value={value} onValueChange={handleValueChange} onOpenChange={handleOpenChange}>
            <SelectTrigger className={`${sizeClasses[size]} ${className}`}>
                <SelectValue>
                    {selectedCountry && (
                        <span className="flex items-center gap-1">
                            <FlagDisplay country={selectedCountry} size={size} />
                            <span>{selectedCountry.code}</span>
                        </span>
                    )}
                </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-48 z-[9999]" sideOffset={4} align="start">
                {/* Search Input */}
                <div className="p-1 border-b">
                    <Input
                        ref={searchInputRef}
                        placeholder="Search countries..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="h-8 text-sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                            // Prevent Enter from closing dropdown
                            if (e.key === 'Enter') {
                                e.preventDefault();
                            }
                            // Prevent Escape from closing dropdown when typing
                            if (e.key === 'Escape' && searchTerm) {
                                e.preventDefault();
                                setSearchTerm('');
                            }
                        }}
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onFocus={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                        }}
                        onBlur={(e) => {
                            e.stopPropagation();
                        }}
                        autoComplete="off"
                        autoFocus={isOpen}
                    />
                </div>
                
                {/* Country List */}
                <div className="max-h-32 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                        filteredCountries.map((country, index) => (
                            <SelectItem 
                                key={`${country.code}-${country.country}-${index}`} 
                                value={country.code}
                                className={size === 'sm' ? 'text-xs' : ''}
                            >
                                <span className="flex items-center gap-2">
                                    <FlagDisplay country={country} size={size} />
                                    <span>{country.code}</span>
                                    {size !== 'sm' && (
                                        <span className="text-gray-500 text-sm">{country.name}</span>
                                    )}
                                </span>
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-2 text-sm text-gray-500 text-center">
                            No countries found
                        </div>
                    )}
                </div>
            </SelectContent>
        </Select>
    );
};

export default CountryCodeSelect;