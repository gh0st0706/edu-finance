import { useEffect, useRef } from "react";

/**
 * EduFin AI — Role-based Finance Platform
 * Converted from a static HTML/CSS/vanilla-JS prototype into a single TSX component.
 * The original markup, styling and interaction logic are preserved as-is:
 *  - CSS is injected via a <style> tag
 *  - Markup is mounted via dangerouslySetInnerHTML
 *  - The original vanilla-JS behaviour is re-attached in a useEffect after mount
 *    (inline onclick/onsubmit attributes in the markup call these same functions,
 *    so they're exposed on `window`).
 */

const STYLES = `
  :root{
    --bg:#F5F7F3;
    --surface:#FFFFFF;
    --surface-2:#EDF2EA;
    --ink:#132520;
    --ink-soft:#4E5F58;
    --ink-faint:#8B978F;
    --line:#DBE3D8;
    --line-soft:#E7ECE4;
    --primary:#0E6B4C;
    --primary-dark:#0A4635;
    --primary-tint:#E2F0E8;
    --primary-tint-strong:#CBE6D8;
    --gold:#B9821B;
    --gold-tint:#FAF0DA;
    --danger:#AE3B3B;
    --danger-tint:#F9EAE9;
    --radius-sm:8px;
    --radius-md:14px;
    --radius-lg:22px;
    --shadow-sm:0 1px 2px rgba(19,37,32,0.06);
    --shadow-md:0 8px 24px -8px rgba(19,37,32,0.18);
    --font-display:'Fraunces', serif;
    --font-body:'Public Sans', sans-serif;
    --font-mono:'IBM Plex Mono', monospace;
  }
  *{box-sizing:border-box;}
  html,body{height:100%;}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body);-webkit-font-smoothing:antialiased;line-height:1.45;}
  svg.icon{width:18px;height:18px;stroke:currentColor;stroke-width:1.6;fill:none;stroke-linecap:round;stroke-linejoin:round;display:block;flex-shrink:0;}
  button{font-family:inherit;cursor:pointer;}
  input,textarea,select{font-family:inherit;}
  a{color:inherit;}
  ::selection{background:var(--primary-tint-strong);}
  .num{font-family:var(--font-mono);font-variant-numeric:tabular-nums;}

  /* ============ LOGIN VIEW ============ */
  #login-view{min-height:100vh;display:grid;grid-template-columns:1.05fr 1fr;}
  .login-brand{
    background:radial-gradient(circle at 85% 12%, rgba(255,255,255,0.06), transparent 40%), linear-gradient(180deg, var(--primary-dark), #082E22 130%);
    color:#EFF6F1;padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;
  }
  .login-brand::before{content:"";position:absolute;inset:0;
    background-image:repeating-linear-gradient(0deg, rgba(255,255,255,0.045) 0, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 42px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 42px);
    pointer-events:none;
  }
  .login-brand > *{position:relative;}
  .brand-mark{display:flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#B9D4C4;}
  .brand-mark .dot{width:8px;height:8px;border-radius:50%;background:var(--gold);}
  .brand-hero h1{font-family:var(--font-display);font-weight:500;font-size:clamp(34px,4vw,50px);line-height:1.08;margin:28px 0 18px;max-width:11ch;}
  .brand-hero h1 em{font-style:italic;color:var(--gold);}
  .brand-hero p{max-width:38ch;color:#C8DBD0;font-size:15.5px;}
  .brand-features{display:flex;flex-direction:column;gap:14px;margin-top:34px;}
  .brand-feature{display:flex;gap:12px;align-items:flex-start;font-size:14px;color:#DCEBE3;}
  .brand-feature svg{stroke:var(--gold);margin-top:2px;}
  .brand-feature b{color:#fff;font-weight:600;}
  .brand-footer{display:flex;justify-content:space-between;align-items:flex-end;font-size:12.5px;color:#8FB1A2;margin-top:40px;}
  .seal{width:64px;height:64px;border-radius:50%;border:1.5px dashed rgba(255,255,255,0.35);display:flex;align-items:center;justify-content:center;transform:rotate(-8deg);font-family:var(--font-mono);font-size:9.5px;letter-spacing:0.06em;text-align:center;color:#B9D4C4;flex-shrink:0;}

  .login-panel{background:var(--surface);display:flex;align-items:center;justify-content:center;padding:40px;}
  .login-card{width:100%;max-width:410px;}
  .login-card h2{font-family:var(--font-display);font-weight:600;font-size:26px;margin:0 0 6px;}
  .login-card>p{color:var(--ink-soft);font-size:14.5px;margin:0 0 24px;}
  .field{margin-bottom:16px;}
  .field label{display:block;font-size:12.5px;font-weight:600;color:var(--ink-soft);margin-bottom:6px;letter-spacing:0.01em;}
  .field input{width:100%;padding:11px 13px;border-radius:var(--radius-sm);border:1.4px solid var(--line);background:var(--bg);font-size:14.5px;color:var(--ink);transition:border-color .15s, box-shadow .15s;}
  .field input:focus{outline:none;border-color:var(--primary);box-shadow:0 0 0 3px var(--primary-tint);}
  .role-active-chip{display:inline-flex;align-items:center;gap:7px;background:var(--primary-tint);color:var(--primary-dark);padding:5px 11px 5px 5px;border-radius:100px;font-size:12.5px;font-weight:600;margin-bottom:20px;}
  .role-active-chip .avatar{width:22px;height:22px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;}
  .btn-primary{width:100%;background:var(--primary);color:#fff;border:none;padding:13px;border-radius:var(--radius-sm);font-size:15px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .15s, transform .1s;box-shadow:var(--shadow-sm);}
  .btn-primary:hover{background:var(--primary-dark);}
  .btn-primary:active{transform:scale(0.99);}
  .login-divider{display:flex;align-items:center;gap:12px;margin:24px 0 16px;color:var(--ink-faint);font-size:12px;text-transform:uppercase;letter-spacing:0.08em;}
  .login-divider::before,.login-divider::after{content:"";flex:1;height:1px;background:var(--line);}
  .role-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .role-card{border:1.4px solid var(--line);border-radius:var(--radius-sm);padding:11px 12px;display:flex;flex-direction:column;gap:3px;background:var(--surface);text-align:left;transition:border-color .15s, background .15s;width:100%;}
  .role-card b{font-size:13px;}
  .role-card span{font-size:11.5px;color:var(--ink-faint);}
  .role-card:hover{background:var(--primary-tint);}
  .role-card.selected{border-color:var(--primary);background:var(--primary-tint);}
  .login-note{margin-top:20px;font-size:12px;color:var(--ink-faint);display:flex;gap:7px;align-items:flex-start;}
  .login-note svg{width:14px;height:14px;margin-top:1px;color:var(--gold);}

  /* ============ APP SHELLS ============ */
  .app-shell{display:none;min-height:100vh;grid-template-columns:252px 1fr;}
  .app-shell.active{display:grid;}
  .sidebar{background:var(--surface-2);border-right:1px solid var(--line);display:flex;flex-direction:column;padding:22px 16px;position:sticky;top:0;height:100vh;}
  .sb-brand{display:flex;align-items:center;gap:9px;padding:4px 8px 22px;}
  .sb-brand .mark{width:30px;height:30px;border-radius:8px;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:600;font-size:15px;}
  .sb-brand .name{font-weight:700;font-size:15.5px;}
  .sb-brand .name small{display:block;font-weight:500;font-size:10.5px;color:var(--ink-faint);letter-spacing:0.05em;text-transform:uppercase;}
  .sb-nav{display:flex;flex-direction:column;gap:2px;flex:1;}
  .sb-link{display:flex;align-items:center;gap:11px;padding:10px 12px;border-radius:10px;color:var(--ink-soft);font-size:14px;font-weight:500;border:none;background:none;text-align:left;width:100%;transition:background .12s, color .12s;}
  .sb-link svg{color:var(--ink-faint);transition:color .12s;}
  .sb-link:hover{background:rgba(14,107,76,0.07);color:var(--ink);}
  .sb-link.active{background:var(--primary);color:#fff;}
  .sb-link.active svg{color:#fff;}
  .sb-section-label{font-size:10.5px;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink-faint);font-weight:600;padding:16px 12px 6px;}
  .sb-user{display:flex;align-items:center;gap:10px;padding:12px;border-radius:12px;background:var(--surface);border:1px solid var(--line);margin-top:10px;}
  .sb-user .avatar{width:34px;height:34px;border-radius:50%;background:var(--primary-dark);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0;}
  .sb-user .who{flex:1;min-width:0;}
  .sb-user .who b{font-size:12.5px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .sb-user .who span{font-size:10.5px;color:var(--ink-faint);}
  .sb-user button{background:none;border:none;color:var(--ink-faint);padding:4px;}
  .sb-user button:hover{color:var(--danger);}

  .main{display:flex;flex-direction:column;min-width:0;}
  .topbar{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 30px;border-bottom:1px solid var(--line);background:var(--surface);position:sticky;top:0;z-index:5;}
  .topbar h1{font-family:var(--font-display);font-size:22px;font-weight:600;margin:0;}
  .topbar-sub{font-size:12.5px;color:var(--ink-faint);margin-top:2px;}
  .search-box{display:flex;align-items:center;gap:8px;background:var(--surface-2);border:1px solid var(--line);border-radius:100px;padding:8px 14px;width:260px;color:var(--ink-faint);}
  .search-box input{border:none;background:none;outline:none;font-size:13.5px;width:100%;color:var(--ink);}
  .topbar-right{display:flex;align-items:center;gap:16px;}
  .icon-btn{position:relative;background:var(--surface-2);border:1px solid var(--line);width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:var(--ink-soft);}
  .icon-btn:hover{background:var(--primary-tint);color:var(--primary-dark);}
  .icon-btn .dot{position:absolute;top:7px;right:7px;width:7px;height:7px;border-radius:50%;background:var(--gold);border:1.5px solid var(--surface);}
  .menu-toggle{display:none;}

  .page{display:none;padding:28px 30px 60px;}
  .page.active{display:block;}

  .kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:20px;}
  .card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-md);padding:20px;box-shadow:var(--shadow-sm);}
  .kpi-card .label{font-size:12.5px;color:var(--ink-faint);font-weight:600;text-transform:uppercase;letter-spacing:0.03em;}
  .kpi-card .value{font-family:var(--font-mono);font-size:26px;font-weight:600;margin:8px 0 6px;}
  .kpi-card .trend{display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;padding:2px 8px 2px 6px;border-radius:100px;}
  .trend.up{background:var(--primary-tint);color:var(--primary-dark);}
  .trend.down{background:var(--danger-tint);color:var(--danger);}
  .trend.flag{background:var(--gold-tint);color:var(--gold);}
  .trend svg{width:13px;height:13px;}

  .ai-banner{display:flex;gap:16px;align-items:flex-start;background:linear-gradient(135deg, var(--gold-tint), #FFF9EE);border:1px solid #EAD6A2;border-radius:var(--radius-md);padding:18px 22px;margin-bottom:20px;}
  .ai-banner .ai-icon{width:38px;height:38px;border-radius:10px;background:var(--gold);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .ai-banner .ai-icon svg{stroke:#fff;}
  .ai-banner h3{margin:0 0 4px;font-size:14.5px;font-weight:700;}
  .ai-banner p{margin:0;font-size:13.5px;color:var(--ink-soft);line-height:1.55;}
  .ai-banner .tag{display:inline-block;margin-top:9px;font-family:var(--font-mono);font-size:10.5px;color:#8A6A1E;background:rgba(185,130,27,0.12);padding:3px 8px;border-radius:6px;}

  .grid-2{display:grid;grid-template-columns:1.5fr 1fr;gap:16px;align-items:start;}
  .grid-2b{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start;}
  .card h3{margin:0 0 4px;font-size:15px;font-weight:700;}
  .card .card-sub{font-size:12.5px;color:var(--ink-faint);margin:0 0 16px;}
  .card-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;gap:10px;}
  .pill-btn{background:var(--surface-2);border:1px solid var(--line);border-radius:100px;padding:6px 13px;font-size:12px;font-weight:600;color:var(--ink-soft);display:flex;align-items:center;gap:5px;white-space:nowrap;}
  .pill-btn:hover{background:var(--primary-tint);color:var(--primary-dark);}
  .pill-btn svg{width:13px;height:13px;}

  .chart-legend{display:flex;gap:18px;font-size:12px;color:var(--ink-soft);margin-top:8px;flex-wrap:wrap;}
  .chart-legend span{display:flex;align-items:center;gap:6px;}
  .swatch{width:11px;height:11px;border-radius:3px;}

  .stamp{display:inline-flex;align-items:center;gap:5px;border:1.3px dashed currentColor;border-radius:100px;padding:3px 9px 3px 8px;font-family:var(--font-mono);font-size:10px;letter-spacing:0.04em;text-transform:uppercase;font-weight:600;transform:rotate(-2.5deg);}
  .stamp.verified{color:var(--primary);}
  .stamp.flagged{color:var(--danger);}
  .stamp.pending{color:var(--gold);}
  .stamp svg{width:11px;height:11px;stroke-width:2;}

  .check-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;}
  .check-list li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;}
  .check-list li svg{color:var(--danger);width:16px;height:16px;margin-top:1px;flex-shrink:0;}
  .check-list li b{display:block;font-size:13px;}
  .check-list li span{font-size:12px;color:var(--ink-faint);}

  .approval-item{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--line-soft);flex-wrap:wrap;}
  .approval-item:last-child{border-bottom:none;padding-bottom:0;}
  .approval-item .meta b{font-size:13.5px;display:block;}
  .approval-item .meta span{font-size:12px;color:var(--ink-faint);}
  .approval-actions{display:flex;gap:6px;}
  .btn-xs{border:1px solid var(--line);background:var(--surface);border-radius:8px;padding:6px 11px;font-size:12px;font-weight:600;color:var(--ink-soft);}
  .btn-xs.approve{background:var(--primary);color:#fff;border-color:var(--primary);}
  .btn-xs.approve:hover{background:var(--primary-dark);}
  .btn-xs.reject:hover{background:var(--danger-tint);color:var(--danger);border-color:var(--danger-tint);}
  .btn-xs.done{opacity:0.5;pointer-events:none;}

  .table-wrap{overflow-x:auto;}
  table{width:100%;border-collapse:collapse;font-size:13.5px;}
  th{text-align:left;font-size:11.5px;text-transform:uppercase;letter-spacing:0.04em;color:var(--ink-faint);font-weight:600;padding:0 14px 10px;border-bottom:1.3px solid var(--line);white-space:nowrap;}
  td{padding:13px 14px;border-bottom:1px solid var(--line-soft);vertical-align:middle;white-space:nowrap;}
  tr:last-child td{border-bottom:none;}
  .cell-name{display:flex;align-items:center;gap:10px;white-space:nowrap;}
  .cell-name .av{width:28px;height:28px;border-radius:50%;background:var(--surface-2);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--ink-soft);flex-shrink:0;}
  .badge{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;font-weight:600;padding:4px 10px;border-radius:100px;}
  .badge.ok{background:var(--primary-tint);color:var(--primary-dark);}
  .badge.warn{background:var(--gold-tint);color:#8A6A1E;}
  .badge.bad{background:var(--danger-tint);color:var(--danger);}
  .badge.mut{background:var(--surface-2);color:var(--ink-faint);}

  .toolbar{display:flex;gap:10px;align-items:center;margin-bottom:16px;flex-wrap:wrap;}
  .tabs{display:flex;gap:4px;background:var(--surface-2);border:1px solid var(--line);border-radius:10px;padding:3px;}
  .tab-btn{border:none;background:none;padding:7px 15px;font-size:13px;font-weight:600;border-radius:8px;color:var(--ink-soft);}
  .tab-btn.active{background:var(--surface);color:var(--primary-dark);box-shadow:var(--shadow-sm);}
  .search-box.sm{width:220px;}
  select.filter-select{border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:9px 12px;font-size:13px;color:var(--ink-soft);font-weight:600;}
  .btn-add{display:flex;align-items:center;gap:6px;background:var(--primary);color:#fff;border:none;border-radius:10px;padding:9px 16px;font-size:13.5px;font-weight:600;margin-left:auto;}
  .btn-add:hover{background:var(--primary-dark);}

  .panel-title-row{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:18px;flex-wrap:wrap;gap:10px;}
  .panel-title-row p{margin:4px 0 0;color:var(--ink-faint);font-size:13.5px;}

  .bill-layout{display:grid;grid-template-columns:1.5fr 1fr;gap:16px;align-items:start;}
  .bill-row{display:flex;gap:14px;padding:16px 4px;border-bottom:1px solid var(--line-soft);align-items:flex-start;cursor:pointer;border-radius:10px;transition:background .12s;}
  .bill-row:hover{background:var(--surface-2);}
  .bill-row:last-child{border-bottom:none;}
  .bill-row.selected{background:var(--primary-tint);}
  .bill-thumb{width:44px;height:44px;border-radius:9px;background:var(--surface-2);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--ink-faint);flex-shrink:0;}
  .bill-info{flex:1;min-width:0;}
  .bill-info .top-row{display:flex;justify-content:space-between;gap:10px;}
  .bill-info b{font-size:14px;}
  .bill-info .amt{font-family:var(--font-mono);font-weight:600;font-size:14px;}
  .bill-info .sub{font-size:12px;color:var(--ink-faint);margin-top:2px;}
  .fraud-meter{display:flex;align-items:center;gap:8px;margin-top:9px;}
  .fraud-meter .bar{flex:1;height:5px;border-radius:3px;background:var(--line-soft);overflow:hidden;max-width:140px;}
  .fraud-meter .bar i{display:block;height:100%;border-radius:3px;}
  .fraud-meter span{font-size:11px;font-weight:700;font-family:var(--font-mono);}

  .detail-card .ocr-row{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px dashed var(--line);font-size:13px;}
  .detail-card .ocr-row:last-child{border-bottom:none;}
  .detail-card .ocr-row span:first-child{color:var(--ink-faint);}
  .detail-card .ocr-row span:last-child{font-family:var(--font-mono);font-weight:600;}
  .dup-alert{display:flex;gap:10px;background:var(--danger-tint);border:1px solid #EBC9C9;border-radius:10px;padding:12px 14px;margin-top:14px;font-size:12.5px;color:#7C2A2A;}
  .dup-alert svg{color:var(--danger);flex-shrink:0;margin-top:1px;}
  .detail-actions{display:flex;gap:10px;margin-top:16px;}
  .detail-actions button{flex:1;padding:11px;border-radius:10px;font-weight:700;font-size:13.5px;border:1px solid var(--line);background:var(--surface);}
  .detail-actions .approve{background:var(--primary);color:#fff;border-color:var(--primary);}
  .detail-actions .reject{color:var(--danger);}

  .report-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
  .report-card .r-icon{width:40px;height:40px;border-radius:10px;background:var(--primary-tint);color:var(--primary-dark);display:flex;align-items:center;justify-content:center;margin-bottom:14px;}
  .report-card h3{margin-bottom:2px;}
  .report-card .gen-date{font-size:12px;color:var(--ink-faint);margin-bottom:16px;}
  .report-card .actions{display:flex;gap:8px;}
  .btn-report{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;background:var(--surface-2);border:1px solid var(--line);border-radius:9px;padding:10px;font-size:13px;font-weight:600;color:var(--ink-soft);}
  .btn-report:hover{background:var(--primary);color:#fff;border-color:var(--primary);}
  .btn-report svg{width:15px;height:15px;}
  .btn-report.loading{pointer-events:none;color:var(--ink-faint);}

  .payroll-toolbar{display:flex;align-items:center;gap:14px;margin-bottom:18px;flex-wrap:wrap;}
  .payroll-summary{display:flex;gap:24px;margin-left:auto;font-size:13px;}
  .payroll-summary b{display:block;font-family:var(--font-mono);font-size:16px;}
  .btn-run{background:var(--primary);color:#fff;border:none;border-radius:10px;padding:11px 20px;font-weight:700;font-size:13.5px;display:flex;align-items:center;gap:8px;}
  .btn-run:hover{background:var(--primary-dark);}

  /* new: read-only / edit / dept-scoped bits */
  .readonly-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;color:var(--ink-faint);background:var(--surface-2);padding:4px 10px;border-radius:100px;border:1px solid var(--line);}
  .icon-edit-btn{background:none;border:1px solid var(--line);width:28px;height:28px;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;color:var(--ink-faint);}
  .icon-edit-btn:hover{background:var(--primary-tint);color:var(--primary-dark);border-color:var(--primary-tint-strong);}
  .icon-edit-btn svg{width:14px;height:14px;}

  .bar-chart-h{display:flex;flex-direction:column;gap:13px;}
  .bar-chart-h .row{display:grid;grid-template-columns:150px 1fr 64px;align-items:center;gap:10px;font-size:12.5px;}
  .bar-chart-h .track{height:10px;background:var(--line-soft);border-radius:5px;overflow:hidden;}
  .bar-chart-h .fill{height:100%;border-radius:5px;background:var(--primary);}
  .bar-chart-h .val{text-align:right;font-family:var(--font-mono);font-weight:600;}

  .yoy-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:6px;}
  .yoy-col{text-align:center;}
  .yoy-bars{display:flex;gap:5px;align-items:flex-end;height:70px;justify-content:center;}
  .yoy-bars i{width:16px;border-radius:4px 4px 0 0;}
  .yoy-bars i.last{background:var(--line);}
  .yoy-bars i.now{background:var(--primary);}
  .yoy-col .lbl{font-size:11.5px;color:var(--ink-faint);margin-top:8px;}

  .budget-bar-track{height:12px;background:var(--line-soft);border-radius:7px;overflow:hidden;margin-top:10px;}
  .budget-bar-fill{height:100%;background:linear-gradient(90deg,var(--primary),var(--primary-dark));border-radius:7px;}
  .budget-legend{display:flex;justify-content:space-between;font-size:12px;color:var(--ink-faint);margin-top:6px;}

  .upload-zone{border:1.6px dashed var(--line);border-radius:var(--radius-md);padding:34px 20px;text-align:center;color:var(--ink-faint);background:var(--surface-2);cursor:pointer;transition:border-color .15s,background .15s;}
  .upload-zone:hover{border-color:var(--primary);background:var(--primary-tint);}
  .upload-zone svg{width:26px;height:26px;margin-bottom:8px;color:var(--ink-faint);}
  .upload-zone b{color:var(--ink);display:block;font-size:14px;margin-bottom:3px;}
  .upload-zone span{font-size:12px;}
  .ocr-progress{margin-top:16px;display:none;}
  .ocr-progress.show{display:block;}
  .ocr-progress .bar-track{height:6px;background:var(--line-soft);border-radius:4px;overflow:hidden;}
  .ocr-progress .bar-fill{height:100%;background:var(--primary);width:0%;border-radius:4px;transition:width .35s linear;}
  .ocr-progress .status-text{font-size:12px;color:var(--ink-faint);margin-top:7px;display:flex;align-items:center;gap:6px;}
  .ocr-result{display:none;margin-top:16px;border-top:1px dashed var(--line);padding-top:16px;}
  .ocr-result.show{display:block;}

  .notif-item{display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--line-soft);align-items:flex-start;}
  .notif-item:last-child{border-bottom:none;}
  .notif-item .n-icon{width:34px;height:34px;border-radius:9px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;color:var(--primary);flex-shrink:0;}
  .notif-item b{font-size:13.5px;display:block;}
  .notif-item span{font-size:12px;color:var(--ink-faint);}
  .notif-item .time{margin-left:auto;font-size:11px;color:var(--ink-faint);white-space:nowrap;}

  .fine-row{display:grid;grid-template-columns:1.4fr 0.7fr 1fr 0.9fr;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line-soft);font-size:13px;}
  .fine-row:last-child{border-bottom:none;}
  .fine-row .fh{font-size:11px;text-transform:uppercase;color:var(--ink-faint);font-weight:600;}

  .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
  .form-grid .full{grid-column:1/-1;}
  textarea.field-textarea{width:100%;padding:11px 13px;border-radius:var(--radius-sm);border:1.4px solid var(--line);background:var(--bg);font-size:13.5px;color:var(--ink);resize:vertical;min-height:70px;}
  textarea.field-textarea:focus{outline:none;border-color:var(--primary);}

  .emi-table{width:100%;border-collapse:collapse;margin-top:12px;}
  .emi-table th{font-size:11px;text-transform:uppercase;color:var(--ink-faint);text-align:left;padding:0 10px 8px;}
  .emi-table td{padding:10px;border-top:1px solid var(--line-soft);font-size:13px;}

  .fee-line{display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px dashed var(--line);font-size:13.5px;}
  .fee-line:last-child{border-bottom:none;}
  .fee-line.total{font-weight:700;border-bottom:none;border-top:1.4px solid var(--line);padding-top:12px;margin-top:4px;}

  .toast{position:fixed;bottom:26px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--ink);color:#fff;padding:11px 20px;border-radius:100px;font-size:13px;font-weight:600;opacity:0;pointer-events:none;transition:opacity .2s, transform .2s;z-index:100;display:flex;align-items:center;gap:8px;max-width:90vw;}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
  .toast svg{width:15px;height:15px;color:#7FD9AE;flex-shrink:0;}

  .ai-fab{position:fixed;bottom:26px;right:26px;width:56px;height:56px;border-radius:50%;background:var(--primary);color:#fff;border:none;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-md);z-index:50;}
  .ai-fab:hover{background:var(--primary-dark);}
  .chat-panel{position:fixed;bottom:94px;right:26px;width:340px;max-height:460px;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius-md);box-shadow:var(--shadow-md);display:none;flex-direction:column;overflow:hidden;z-index:50;}
  .chat-panel.open{display:flex;}
  .chat-head{background:var(--primary-dark);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px;}
  .chat-head svg{stroke:var(--gold);}
  .chat-head b{font-size:13.5px;display:block;}
  .chat-head span{font-size:11px;color:#B9D4C4;}
  .chat-body{flex:1;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:10px;background:var(--bg);}
  .msg{max-width:85%;padding:9px 12px;border-radius:12px;font-size:13px;line-height:1.4;}
  .msg.bot{background:var(--surface);border:1px solid var(--line);align-self:flex-start;border-bottom-left-radius:3px;}
  .msg.user{background:var(--primary);color:#fff;align-self:flex-end;border-bottom-right-radius:3px;}
  .chat-input-row{display:flex;gap:8px;padding:12px;border-top:1px solid var(--line);background:var(--surface);}
  .chat-input-row input{flex:1;border:1px solid var(--line);border-radius:100px;padding:9px 13px;font-size:13px;outline:none;}
  .chat-input-row input:focus{border-color:var(--primary);}
  .chat-input-row button{background:var(--primary);color:#fff;border:none;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;}

  @media (max-width:1080px){
    .kpi-row{grid-template-columns:repeat(2,1fr);}
    .grid-2, .grid-2b, .bill-layout, .form-grid{grid-template-columns:1fr;}
    .report-grid{grid-template-columns:repeat(2,1fr);}
    .yoy-grid{grid-template-columns:repeat(2,1fr);}
  }
  @media (max-width:760px){
    #login-view{grid-template-columns:1fr;}
    .login-brand{display:none;}
    .app-shell.active{grid-template-columns:1fr;}
    .sidebar{position:fixed;left:-260px;top:0;bottom:0;z-index:40;transition:left .2s;width:252px;}
    .sidebar.open{left:0;}
    .search-box{display:none;}
    .kpi-row{grid-template-columns:1fr;}
    .report-grid{grid-template-columns:1fr;}
    .menu-toggle{display:flex !important;}
    .fine-row{grid-template-columns:1fr;gap:4px;}
  }
  @media (prefers-reduced-motion: reduce){ *{transition:none !important;} }
</style>
`;

const BODY_HTML = `
<svg width="0" height="0" style="position:absolute">
<defs>
<symbol id="i-grid" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></symbol>
<symbol id="i-users" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></symbol>
<symbol id="i-wallet" viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h13v4"/><path d="M3 7v11a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-5a2.5 2.5 0 0 1 0-5h5"/></symbol>
<symbol id="i-receipt" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></symbol>
<symbol id="i-card" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2.5"/><line x1="1" y1="10" x2="23" y2="10"/></symbol>
<symbol id="i-file" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></symbol>
<symbol id="i-bell" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></symbol>
<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></symbol>
<symbol id="i-logout" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></symbol>
<symbol id="i-alert" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></symbol>
<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></symbol>
<symbol id="i-sparkle" viewBox="0 0 24 24"><path d="M12 2l1.7 5.9L19.5 9l-5.8 1.7L12 16.5l-1.7-5.8L4.5 9l5.8-1.1L12 2z"/></symbol>
<symbol id="i-upload" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></symbol>
<symbol id="i-filter" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></symbol>
<symbol id="i-lock" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></symbol>
<symbol id="i-up" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></symbol>
<symbol id="i-down" viewBox="0 0 24 24"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></symbol>
<symbol id="i-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></symbol>
<symbol id="i-send" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></symbol>
<symbol id="i-chev" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></symbol>
<symbol id="i-edit" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></symbol>
<symbol id="i-eye" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></symbol>
<symbol id="i-percent" viewBox="0 0 24 24"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></symbol>
</defs>
</svg>

<!-- ============ LOGIN VIEW ============ -->
<div id="login-view">
  <div class="login-brand">
    <div>
      <div class="brand-mark"><span class="dot"></span> EDUFIN AI — INSTITUTIONAL FINANCE</div>
      <div class="brand-hero">
        <h1>Every rupee, <em>accounted for.</em></h1>
        <p>One role-aware platform for fees, payroll, budgets and reporting — with explainable AI built into the ledger itself, not bolted on as a chatbot.</p>
      </div>
      <div class="brand-features">
        <div class="brand-feature"><svg class="icon" width="16" height="16"><use href="#i-receipt"/></svg><div><b>OCR bill digitization</b> — scan, extract, categorize every reimbursement automatically.</div></div>
        <div class="brand-feature"><svg class="icon" width="16" height="16"><use href="#i-alert"/></svg><div><b>Duplicate &amp; fraud detection</b> — fuzzy-matched against every prior entry, no manual cross-checking.</div></div>
        <div class="brand-feature"><svg class="icon" width="16" height="16"><use href="#i-up"/></svg><div><b>Revenue forecasting</b> — real regression on historical collections, not a guess.</div></div>
      </div>
    </div>
    <div class="brand-footer">
      <div>Single login · JWT role routing<br>4 dashboards, one seeded demo environment</div>
      <div class="seal">RULE<br>BASED<br>AI</div>
    </div>
  </div>

  <div class="login-panel">
    <div class="login-card">
      <h2>Sign in</h2>
      <p>Single login, role-aware routing — pick a demo account below.</p>

      <div class="role-active-chip" id="active-role-chip"><span class="avatar" id="chip-avatar">FA</span> <span id="chip-text">Finance Admin selected</span></div>

      <form id="login-form">
        <div class="field">
          <label for="login-email">Work email</label>
          <input id="login-email" type="text" value="accounts@stmarks.edu.in" required>
        </div>
        <div class="field">
          <label for="login-pass">Password</label>
          <input id="login-pass" type="password" value="••••••••••" required>
        </div>
        <button type="submit" class="btn-primary">
          Sign in to dashboard
          <svg class="icon" width="16" height="16" style="stroke:#fff"><use href="#i-chev"/></svg>
        </button>
      </form>

      <div class="login-divider">demo roles</div>
      <div class="role-grid">
        <button type="button" class="role-card selected" data-role="finance" data-init="FA" data-email="accounts@stmarks.edu.in" data-label="Finance Admin selected">
          <b>Finance Admin</b><span>Full read + write</span>
        </button>
        <button type="button" class="role-card" data-role="supreme" data-init="VI" data-email="principal@stmarks.edu.in" data-label="Supreme (Principal) selected">
          <b>Supreme (Principal)</b><span>Read + approve</span>
        </button>
        <button type="button" class="role-card" data-role="depthead" data-init="GS" data-email="hod.mech@stmarks.edu.in" data-label="Dept. Head selected">
          <b>Dept. Head</b><span>Scoped read/write</span>
        </button>
        <button type="button" class="role-card" data-role="student" data-init="AV" data-email="aarav.v@stmarks.edu.in" data-label="Student selected">
          <b>Student</b><span>Own records only</span>
        </button>
      </div>

      <div class="login-note">
        <svg class="icon"><use href="#i-sparkle"/></svg>
        <span>All four dashboards are seeded with demo data. Permissions differ by role — Supreme and Student are read-scoped, Finance Admin and Dept. Head can write within their scope.</span>
      </div>
    </div>
  </div>
</div>

<!-- =====================================================================
     SHELL 1 — FINANCE ADMIN
====================================================================== -->
<div class="app-shell" id="shell-finance">
  <aside class="sidebar">
    <div class="sb-brand"><div class="mark">Ef</div><div class="name">EduFin AI<small>St. Mark's Institutions</small></div></div>
    <nav class="sb-nav">
      <div class="sb-section-label">Workspace</div>
      <button class="sb-link active" data-target="overview" data-label="Overview"><svg class="icon"><use href="#i-grid"/></svg> Overview</button>
      <button class="sb-link" data-target="people" data-label="Student &amp; Staff DB"><svg class="icon"><use href="#i-users"/></svg> Student &amp; Staff DB</button>
      <button class="sb-link" data-target="fees" data-label="Fees &amp; Scholarships"><svg class="icon"><use href="#i-wallet"/></svg> Fees &amp; Scholarships</button>
      <button class="sb-link" data-target="bills" data-label="Bill Verification"><svg class="icon"><use href="#i-receipt"/></svg> Bill Verification</button>
      <button class="sb-link" data-target="payroll" data-label="Payroll"><svg class="icon"><use href="#i-card"/></svg> Payroll</button>
      <button class="sb-link" data-target="reports" data-label="Reports"><svg class="icon"><use href="#i-file"/></svg> Reports</button>
    </nav>
    <div class="sb-user">
      <div class="avatar">RA</div>
      <div class="who"><b>Rekha Ananthan</b><span>FINANCE_ADMIN</span></div>
      <button class="logout-btn" title="Log out"><svg class="icon" width="16" height="16"><use href="#i-logout"/></svg></button>
    </div>
  </aside>

  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:14px;">
        <button class="icon-btn menu-toggle"><svg class="icon"><use href="#i-menu"/></svg></button>
        <div><h1 class="pt-title">Overview</h1><div class="topbar-sub">Wednesday, 31 July 2026 · FY 2026–27 · Full read + write</div></div>
      </div>
      <div class="search-box"><svg class="icon" width="15" height="15"><use href="#i-search"/></svg><input placeholder="Search students, bills, receipts…"></div>
      <div class="topbar-right">
        <button class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><span class="dot"></span></button>
        <div style="width:1px;height:26px;background:var(--line);"></div>
        <div class="cell-name"><div class="av">RA</div> <span style="font-size:13px;font-weight:600;">Rekha A.</span></div>
      </div>
    </div>

    <section class="page active" data-page="overview">
      <div class="ai-banner">
        <div class="ai-icon"><svg class="icon" width="19" height="19"><use href="#i-sparkle"/></svg></div>
        <div>
          <h3>AI Executive Summary</h3>
          <p>Revenue is up <b>8%</b> month-on-month on ₹63.4L in collections. The fraud-detection engine flagged <b>3 duplicate bills</b>, avoiding roughly <b>₹42,000</b> in double reimbursement. <b>12 students</b> are trending toward fee-default based on punctuality scoring.</p>
          <span class="tag">Generated from rule-based scoring · fully explainable</span>
        </div>
      </div>

      <div class="kpi-row">
        <div class="card kpi-card"><div class="label">Total revenue (YTD)</div><div class="value num">₹6.42 Cr</div><span class="trend up"><svg class="icon"><use href="#i-up"/></svg> 8.2%</span></div>
        <div class="card kpi-card"><div class="label">Total expenditure (YTD)</div><div class="value num">₹4.82 Cr</div><span class="trend up"><svg class="icon"><use href="#i-up"/></svg> 4.1%</span></div>
        <div class="card kpi-card"><div class="label">Pending dues</div><div class="value num">₹18.6 L</div><span class="trend flag"><svg class="icon"><use href="#i-alert"/></svg> 214 students</span></div>
        <div class="card kpi-card"><div class="label">Flagged bills</div><div class="value num">07</div><span class="trend down"><svg class="icon"><use href="#i-alert"/></svg> 3 duplicate</span></div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-head"><div><h3>Revenue vs. expenditure</h3><p class="card-sub">Apr 2025 – Mar 2026, ₹ in lakhs</p></div><button class="pill-btn"><svg class="icon"><use href="#i-download"/></svg> Export</button></div>
          <svg viewBox="0 0 640 260" width="100%" style="overflow:visible">
            <line x1="40" y1="20" x2="620" y2="20" stroke="var(--line-soft)"/><line x1="40" y1="120" x2="620" y2="120" stroke="var(--line-soft)"/><line x1="40" y1="220" x2="620" y2="220" stroke="var(--line)"/>
            <text x="34" y="24" text-anchor="end" font-size="10" font-family="IBM Plex Mono" fill="var(--ink-faint)">70L</text>
            <text x="34" y="124" text-anchor="end" font-size="10" font-family="IBM Plex Mono" fill="var(--ink-faint)">35L</text>
            <text x="34" y="224" text-anchor="end" font-size="10" font-family="IBM Plex Mono" fill="var(--ink-faint)">0</text>
            <path d="M40,100 L92.7,91.4 L145.5,82.9 L198.2,74.3 L250.9,108.6 L303.6,62.9 L356.4,54.3 L409.1,45.7 L461.8,57.1 L514.5,40 L567.3,31.4 L620,20 L620,220 L40,220 Z" fill="var(--primary)" opacity="0.12"/>
            <path d="M40,100 L92.7,91.4 L145.5,82.9 L198.2,74.3 L250.9,108.6 L303.6,62.9 L356.4,54.3 L409.1,45.7 L461.8,57.1 L514.5,40 L567.3,31.4 L620,20" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M40,120 L92.7,114.3 L145.5,117.1 L198.2,105.7 L250.9,125.7 L303.6,100 L356.4,94.3 L409.1,91.4 L461.8,97.1 L514.5,85.7 L567.3,80 L620,74.3" fill="none" stroke="var(--gold)" stroke-width="2.2" stroke-dasharray="1 6" stroke-linecap="round"/>
            <g font-size="10" font-family="IBM Plex Mono" fill="var(--ink-faint)">
              <text x="40" y="238" text-anchor="middle">Apr</text><text x="92.7" y="238" text-anchor="middle">May</text><text x="145.5" y="238" text-anchor="middle">Jun</text><text x="198.2" y="238" text-anchor="middle">Jul</text>
              <text x="250.9" y="238" text-anchor="middle">Aug</text><text x="303.6" y="238" text-anchor="middle">Sep</text><text x="356.4" y="238" text-anchor="middle">Oct</text><text x="409.1" y="238" text-anchor="middle">Nov</text>
              <text x="461.8" y="238" text-anchor="middle">Dec</text><text x="514.5" y="238" text-anchor="middle">Jan</text><text x="567.3" y="238" text-anchor="middle">Feb</text><text x="620" y="238" text-anchor="middle">Mar</text>
            </g>
          </svg>
          <div class="chart-legend"><span><i class="swatch" style="background:var(--primary)"></i> Revenue</span><span><i class="swatch" style="background:var(--gold)"></i> Expenditure</span><span style="color:var(--ink-faint)">Forecast: linear regression on 12mo trailing data</span></div>
        </div>

        <div class="card">
          <h3>Compliance monitor</h3><p class="card-sub">3 items need attention this cycle</p>
          <ul class="check-list">
            <li><svg class="icon"><use href="#i-alert"/></svg><div><b>GSTIN verification pending</b><span>2 vendor bills missing valid GSTIN</span></div></li>
            <li><svg class="icon"><use href="#i-alert"/></svg><div><b>Audit report overdue</b><span>FY 2024–25 report is 6 days past deadline</span></div></li>
            <li><svg class="icon"><use href="#i-alert"/></svg><div><b>Fee report unfiled</b><span>Q1 FY2026–27 fee report not yet submitted</span></div></li>
          </ul>
        </div>
      </div>

      <div class="grid-2b" style="margin-top:16px;">
        <div class="card">
          <div class="card-head"><h3>Pending approvals</h3></div>
          <div class="approval-item"><div class="meta"><b>Robotics Club — Annual TechFest</b><span>Event fund request · Dept. of Mechanical Engg.</span></div><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Approved ₹85,000 for TechFest')">Approve</button><button class="btn-xs reject" onclick="resolveApproval(this,'Request sent back to department')">Reject</button></div></div>
          <div class="approval-item"><div class="meta"><b>5 scholarship endorsements</b><span>AI-recommended list · HOD Mechanical, pending co-sign</span></div><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Endorsements confirmed')">Approve</button><button class="btn-xs reject" onclick="resolveApproval(this,'Sent for review')">Review</button></div></div>
          <div class="approval-item"><div class="meta"><b>GST report draft — June 2026</b><span>AI-assisted GSTR aggregation ready for sign-off</span></div><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'GST draft finalized')">Finalize</button><button class="btn-xs reject" onclick="resolveApproval(this,'Sent back for edits')">Edit</button></div></div>
        </div>
        <div class="card">
          <div class="card-head"><h3>Smart payment reminders</h3></div>
          <p class="card-sub" style="margin-bottom:12px;">Escalation tone scales as due date nears — sent automatically.</p>
          <div class="approval-item"><div class="meta"><b>142 students</b><span>Gentle reminder · due in 14 days</span></div><span class="badge ok">Sent</span></div>
          <div class="approval-item"><div class="meta"><b>58 students</b><span>Follow-up · due in 5 days</span></div><span class="badge warn">Sent</span></div>
          <div class="approval-item"><div class="meta"><b>12 students</b><span>Final notice · overdue, default risk</span></div><span class="badge bad">Scheduled 8 PM</span></div>
        </div>
      </div>
    </section>

    <section class="page" data-page="people">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Student &amp; Staff records</h1><p>Full institution-wide read + write access.</p></div></div>
      <div class="tabs" style="margin-bottom:18px;"><button class="tab-btn active" data-ptab="fin-students">Student DB</button><button class="tab-btn" data-ptab="fin-staff">Staff DB</button></div>
      <div id="fin-students">
        <div class="toolbar">
          <div class="search-box sm"><svg class="icon" width="14" height="14"><use href="#i-search"/></svg><input placeholder="Search students…"></div>
          <select class="filter-select"><option>All departments</option><option>Computer Science</option><option>Mechanical Engg.</option><option>Commerce</option></select>
          <button class="pill-btn"><svg class="icon"><use href="#i-filter"/></svg> Dues status</button>
          <button class="btn-add"><svg class="icon" width="15" height="15" style="stroke:#fff"><use href="#i-plus"/></svg> Add student</button>
        </div>
        <div class="card" style="padding:8px 20px;">
          <div class="table-wrap"><table>
            <thead><tr><th>Roll no.</th><th>Student</th><th>Department</th><th>Fee category</th><th>Dues</th><th>Punctuality</th></tr></thead>
            <tbody>
              <tr><td class="num">21CS114</td><td><div class="cell-name"><div class="av">AV</div>Aarav Venkatesan</div></td><td>Computer Science</td><td>General</td><td><span class="badge ok">Paid</span></td><td class="num">92</td></tr>
              <tr><td class="num">21ME087</td><td><div class="cell-name"><div class="av">SN</div>Sneha Natarajan</div></td><td>Mechanical Engg.</td><td>Scholarship</td><td><span class="badge warn">Due in 5d</span></td><td class="num">78</td></tr>
              <tr><td class="num">22CM045</td><td><div class="cell-name"><div class="av">RK</div>Ravi Kumaran</div></td><td>Commerce</td><td>General</td><td><span class="badge bad">Overdue</span></td><td class="num">41</td></tr>
              <tr><td class="num">21CS201</td><td><div class="cell-name"><div class="av">PM</div>Priya Mahalingam</div></td><td>Computer Science</td><td>Management quota</td><td><span class="badge ok">Paid</span></td><td class="num">97</td></tr>
              <tr><td class="num">23ME012</td><td><div class="cell-name"><div class="av">KJ</div>Karthik Jayaraman</div></td><td>Mechanical Engg.</td><td>General</td><td><span class="badge bad">Overdue</span></td><td class="num">35</td></tr>
              <tr><td class="num">22CS098</td><td><div class="cell-name"><div class="av">DS</div>Divya Sundaram</div></td><td>Computer Science</td><td>Scholarship</td><td><span class="badge ok">Paid</span></td><td class="num">88</td></tr>
            </tbody>
          </table></div>
        </div>
      </div>
      <div id="fin-staff" style="display:none;">
        <div class="toolbar">
          <div class="search-box sm"><svg class="icon" width="14" height="14"><use href="#i-search"/></svg><input placeholder="Search staff…"></div>
          <select class="filter-select"><option>All departments</option><option>Computer Science</option><option>Mechanical Engg.</option><option>Administration</option></select>
          <button class="btn-add"><svg class="icon" width="15" height="15" style="stroke:#fff"><use href="#i-plus"/></svg> Add staff</button>
        </div>
        <div class="card" style="padding:8px 20px;">
          <div class="table-wrap"><table>
            <thead><tr><th>Staff ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Salary structure</th><th>Payroll status</th></tr></thead>
            <tbody>
              <tr><td class="num">STF-014</td><td><div class="cell-name"><div class="av">MR</div>Meera Rajagopal</div></td><td>Computer Science</td><td>Associate Professor</td><td>Grade B</td><td><span class="badge ok">Disbursed</span></td></tr>
              <tr><td class="num">STF-029</td><td><div class="cell-name"><div class="av">SP</div>Suresh Pillai</div></td><td>Mechanical Engg.</td><td>Lab Assistant</td><td>Grade D</td><td><span class="badge warn">Pending</span></td></tr>
              <tr><td class="num">STF-002</td><td><div class="cell-name"><div class="av">AN</div>Anand Narayan</div></td><td>Administration</td><td>Registrar</td><td>Grade A</td><td><span class="badge ok">Disbursed</span></td></tr>
              <tr><td class="num">STF-047</td><td><div class="cell-name"><div class="av">LT</div>Lakshmi Thangam</div></td><td>Commerce</td><td>Assistant Professor</td><td>Grade C</td><td><span class="badge ok">Disbursed</span></td></tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </section>

    <section class="page" data-page="fees">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Fees &amp; scholarships</h1><p>Fee structures institution-wide, plus AI-ranked scholarship recommendations.</p></div><button class="btn-add" style="margin-left:0;"><svg class="icon" width="15" height="15" style="stroke:#fff"><use href="#i-plus"/></svg> New fee structure</button></div>
      <div class="grid-2b">
        <div class="card"><h3>Computer Science · General</h3><p class="card-sub">FY 2026–27 · ₹1,42,000 total</p><button class="pill-btn" style="margin-top:6px;">Edit structure</button></div>
        <div class="card"><h3>Mechanical Engg. · Management quota</h3><p class="card-sub">FY 2026–27 · ₹2,10,000 total</p><button class="pill-btn" style="margin-top:6px;">Edit structure</button></div>
      </div>
      <div class="card" style="margin-top:16px;">
        <div class="card-head"><div><h3>AI scholarship recommendations</h3><p class="card-sub">Weighted score: attendance · income bracket · academics · department quota · history</p></div><span class="tag" style="background:var(--gold-tint);color:#8A6A1E;font-family:var(--font-mono);font-size:10.5px;padding:4px 10px;border-radius:6px;">Rule-based · explainable</span></div>
        <div class="approval-item"><div class="meta"><b>Divya Sundaram · 22CS098</b><span>Attendance 94% · Income bracket L2 · Academics 91% · Quota available</span></div><div style="display:flex;align-items:center;gap:14px;"><span class="num" style="font-weight:700;color:var(--primary-dark);">92</span><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Endorsed for scholarship')">Endorse</button><button class="btn-xs reject">Reject</button></div></div></div>
        <div class="approval-item"><div class="meta"><b>Karthik Jayaraman · 23ME012</b><span>Attendance 88% · Income bracket L1 · Academics 84% · Quota available</span></div><div style="display:flex;align-items:center;gap:14px;"><span class="num" style="font-weight:700;color:var(--primary-dark);">88</span><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Endorsed for scholarship')">Endorse</button><button class="btn-xs reject">Reject</button></div></div></div>
        <div class="approval-item"><div class="meta"><b>Sneha Natarajan · 21ME087</b><span>Attendance 79% · Income bracket L2 · Academics 88% · Quota limited</span></div><div style="display:flex;align-items:center;gap:14px;"><span class="num" style="font-weight:700;color:var(--gold);">71</span><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Endorsed for scholarship')">Endorse</button><button class="btn-xs reject">Reject</button></div></div></div>
      </div>
    </section>

    <section class="page" data-page="bills">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Bill verification queue</h1><p>OCR-extracted bills, scored for duplicate &amp; fraud risk before reimbursement.</p></div><button class="btn-add" style="margin-left:0;"><svg class="icon" width="15" height="15" style="stroke:#fff"><use href="#i-upload"/></svg> Upload bill</button></div>
      <div class="bill-layout">
        <div class="card">
          <div class="bill-row selected" onclick="selectBill(this,0)"><div class="bill-thumb"><svg class="icon"><use href="#i-receipt"/></svg></div><div class="bill-info"><div class="top-row"><b>Metro Electricals</b><span class="amt num">₹18,500</span></div><div class="sub">Utilities · Uploaded by Dept. Mechanical · OCR confidence 94%</div><div class="fraud-meter"><div class="bar"><i style="width:86%;background:var(--danger)"></i></div><span style="color:var(--danger)">HIGH · 86</span></div></div></div>
          <div class="bill-row" onclick="selectBill(this,1)"><div class="bill-thumb"><svg class="icon"><use href="#i-receipt"/></svg></div><div class="bill-info"><div class="top-row"><b>Campus Catering Co.</b><span class="amt num">₹32,000</span></div><div class="sub">Hostel &amp; mess · Uploaded by Student · OCR confidence 91%</div><div class="fraud-meter"><div class="bar"><i style="width:48%;background:var(--gold)"></i></div><span style="color:var(--gold)">MEDIUM · 48</span></div></div></div>
          <div class="bill-row" onclick="selectBill(this,2)"><div class="bill-thumb"><svg class="icon"><use href="#i-receipt"/></svg></div><div class="bill-info"><div class="top-row"><b>Sunrise Stationery Mart</b><span class="amt num">₹4,200</span></div><div class="sub">Stationery · Uploaded by Dept. Commerce · OCR confidence 97%</div><div class="fraud-meter"><div class="bar"><i style="width:12%;background:var(--primary)"></i></div><span style="color:var(--primary)">LOW · 12</span></div></div></div>
          <div class="bill-row" onclick="selectBill(this,3)"><div class="bill-thumb"><svg class="icon"><use href="#i-receipt"/></svg></div><div class="bill-info"><div class="top-row"><b>Ace Print Solutions</b><span class="amt num">₹6,750</span></div><div class="sub">Printing · Uploaded by Dept. Computer Science · OCR confidence 95%</div><div class="fraud-meter"><div class="bar"><i style="width:8%;background:var(--primary)"></i></div><span style="color:var(--primary)">LOW · 08</span></div></div></div>
        </div>
        <div class="card detail-card" id="bill-detail">
          <div class="card-head"><h3 id="dt-vendor">Metro Electricals</h3><span class="stamp flagged"><svg class="icon"><use href="#i-alert"/></svg> Flagged</span></div>
          <div class="ocr-row"><span>Amount</span><span id="dt-amt">₹18,500.00</span></div>
          <div class="ocr-row"><span>Category</span><span id="dt-cat">Utilities</span></div>
          <div class="ocr-row"><span>Bill date</span><span id="dt-date">14 Jul 2026</span></div>
          <div class="ocr-row"><span>Vendor GSTIN</span><span id="dt-gst">33ABCDE1234F1Z5</span></div>
          <div class="ocr-row"><span>Uploaded by</span><span id="dt-by">Mechanical Engg. dept.</span></div>
          <div class="ocr-row"><span>Fraud score</span><span id="dt-score" style="color:var(--danger)">86 / 100</span></div>
          <div class="dup-alert" id="dup-alert"><svg class="icon"><use href="#i-alert"/></svg><div><b>Possible duplicate.</b> Matches Bill #B-2291 (98% vendor+amount+date similarity), submitted 9 days earlier.</div></div>
          <div class="detail-actions"><button class="reject" onclick="verifyBill('rejected')">Reject</button><button class="approve" onclick="verifyBill('approved')">Approve reimbursement</button></div>
        </div>
      </div>
    </section>

    <section class="page" data-page="payroll">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Payroll</h1><p>Run monthly payroll and track disbursement across departments.</p></div></div>
      <div class="payroll-toolbar">
        <select class="filter-select"><option>July 2026</option><option>June 2026</option><option>May 2026</option></select>
        <button class="btn-run" onclick="runPayroll(this)"><svg class="icon" width="15" height="15" style="stroke:#fff"><use href="#i-card"/></svg> Run payroll</button>
        <div class="payroll-summary"><div><span style="color:var(--ink-faint);font-size:12px;">Total staff</span><b>62</b></div><div><span style="color:var(--ink-faint);font-size:12px;">Net payout</span><b class="num">₹31.8 L</b></div><div><span style="color:var(--ink-faint);font-size:12px;">Disbursed</span><b class="num">54 / 62</b></div></div>
      </div>
      <div class="card" style="padding:8px 20px;">
        <div class="table-wrap"><table>
          <thead><tr><th>Staff</th><th>Department</th><th>Basic</th><th>Allowances</th><th>Deductions</th><th>Net pay</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td><div class="cell-name"><div class="av">MR</div>Meera Rajagopal</div></td><td>Computer Science</td><td class="num">₹68,000</td><td class="num">₹12,400</td><td class="num">₹6,200</td><td class="num" style="font-weight:700;">₹74,200</td><td><span class="badge ok">Disbursed</span></td></tr>
            <tr><td><div class="cell-name"><div class="av">SP</div>Suresh Pillai</div></td><td>Mechanical Engg.</td><td class="num">₹31,000</td><td class="num">₹5,100</td><td class="num">₹2,800</td><td class="num" style="font-weight:700;">₹33,300</td><td><span class="badge warn">Pending</span></td></tr>
            <tr><td><div class="cell-name"><div class="av">AN</div>Anand Narayan</div></td><td>Administration</td><td class="num">₹82,000</td><td class="num">₹15,000</td><td class="num">₹8,100</td><td class="num" style="font-weight:700;">₹88,900</td><td><span class="badge ok">Disbursed</span></td></tr>
            <tr><td><div class="cell-name"><div class="av">LT</div>Lakshmi Thangam</div></td><td>Commerce</td><td class="num">₹54,000</td><td class="num">₹9,600</td><td class="num">₹4,900</td><td class="num" style="font-weight:700;">₹58,700</td><td><span class="badge ok">Disbursed</span></td></tr>
          </tbody>
        </table></div>
      </div>
    </section>

    <section class="page" data-page="reports">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Reports</h1><p>Generate and download institution-wide financial reports as PDF.</p></div></div>
      <div class="report-grid">
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-file"/></svg></div><h3>Balance Sheet</h3><div class="gen-date">Last generated 2 days ago</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> Generate PDF</button></div></div>
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-file"/></svg></div><h3>Income Statement</h3><div class="gen-date">Last generated 2 days ago</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> Generate PDF</button></div></div>
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-shield"/></svg></div><h3>Audit Report</h3><div class="gen-date">Overdue · FY 2024–25</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> Generate PDF</button></div></div>
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-sparkle"/></svg></div><h3>GST Report</h3><div class="gen-date">AI-assisted draft ready · June 2026</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> Generate PDF</button></div></div>
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-wallet"/></svg></div><h3>Fee Report</h3><div class="gen-date">Q1 not yet filed</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> Generate PDF</button></div></div>
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-receipt"/></svg></div><h3>EOD Report</h3><div class="gen-date">Auto-generated today, 6:00 PM</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> Generate PDF</button></div></div>
      </div>
    </section>
  </div>
</div>

<!-- =====================================================================
     SHELL 2 — SUPREME (PRINCIPAL / TRUSTEE)
====================================================================== -->
<div class="app-shell" id="shell-supreme">
  <aside class="sidebar">
    <div class="sb-brand"><div class="mark">Ef</div><div class="name">EduFin AI<small>St. Mark's Institutions</small></div></div>
    <nav class="sb-nav">
      <div class="sb-section-label">Workspace</div>
      <button class="sb-link active" data-target="ov" data-label="Overview"><svg class="icon"><use href="#i-grid"/></svg> Overview</button>
      <button class="sb-link" data-target="stu" data-label="Student DB"><svg class="icon"><use href="#i-users"/></svg> Student DB</button>
      <button class="sb-link" data-target="staff" data-label="Staff DB"><svg class="icon"><use href="#i-users"/></svg> Staff DB</button>
      <button class="sb-link" data-target="pay" data-label="Payroll overview"><svg class="icon"><use href="#i-card"/></svg> Payroll Overview</button>
      <button class="sb-link" data-target="an" data-label="Analytics"><svg class="icon"><use href="#i-up"/></svg> Analytics</button>
      <button class="sb-link" data-target="fs" data-label="Fees &amp; Scholarships"><svg class="icon"><use href="#i-wallet"/></svg> Fees &amp; Scholarships</button>
      <button class="sb-link" data-target="rep" data-label="Reports"><svg class="icon"><use href="#i-file"/></svg> Reports</button>
    </nav>
    <div class="sb-user">
      <div class="avatar">VI</div>
      <div class="who"><b>Dr. Vikram Iyer</b><span>SUPREME · Principal</span></div>
      <button class="logout-btn" title="Log out"><svg class="icon" width="16" height="16"><use href="#i-logout"/></svg></button>
    </div>
  </aside>

  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:14px;">
        <button class="icon-btn menu-toggle"><svg class="icon"><use href="#i-menu"/></svg></button>
        <div><h1 class="pt-title">Overview</h1><div class="topbar-sub">Institution-wide · Read + approval authority</div></div>
      </div>
      <div class="search-box"><svg class="icon" width="15" height="15"><use href="#i-search"/></svg><input placeholder="Search records, reports…"></div>
      <div class="topbar-right"><button class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><span class="dot"></span></button><div style="width:1px;height:26px;background:var(--line);"></div><div class="cell-name"><div class="av">VI</div><span style="font-size:13px;font-weight:600;">Dr. Iyer</span></div></div>
    </div>

    <section class="page active" data-page="ov">
      <div class="ai-banner">
        <div class="ai-icon"><svg class="icon" width="19" height="19"><use href="#i-sparkle"/></svg></div>
        <div><h3>AI Executive Summary</h3><p>This month: revenue is up <b>8%</b> to ₹63.4L. <b>3 flagged duplicate bills</b> saved an estimated <b>₹42,000</b>. <b>12 students</b> are trending toward fee-default risk based on punctuality scoring — recommend approving the escalated reminder cadence.</p><span class="tag">Generated from rule-based scoring · fully explainable</span></div>
      </div>
      <div class="kpi-row">
        <div class="card kpi-card"><div class="label">Total revenue (YTD)</div><div class="value num">₹6.42 Cr</div><span class="trend up"><svg class="icon"><use href="#i-up"/></svg> 8.2%</span></div>
        <div class="card kpi-card"><div class="label">Total expenditure (YTD)</div><div class="value num">₹4.82 Cr</div><span class="trend up"><svg class="icon"><use href="#i-up"/></svg> 4.1%</span></div>
        <div class="card kpi-card"><div class="label">Net surplus (YTD)</div><div class="value num">₹1.60 Cr</div><span class="trend up"><svg class="icon"><use href="#i-up"/></svg> 15.7%</span></div>
        <div class="card kpi-card"><div class="label">Compliance items open</div><div class="value num">03</div><span class="trend flag"><svg class="icon"><use href="#i-alert"/></svg> Needs review</span></div>
      </div>
      <div class="card" style="margin-bottom:16px;">
        <div class="card-head"><h3>Pending approvals</h3><span class="readonly-badge"><svg class="icon" style="width:11px;height:11px;"><use href="#i-shield"/></svg> Approval authority</span></div>
        <div class="approval-item"><div class="meta"><b>Robotics Club — Annual TechFest</b><span>Event fund request ₹85,000 · Dept. of Mechanical Engg. · pre-approved by Finance</span></div><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Final approval granted')">Approve</button><button class="btn-xs reject" onclick="resolveApproval(this,'Sent back for revision')">Reject</button></div></div>
        <div class="approval-item"><div class="meta"><b>5 scholarship recommendations</b><span>AI-flagged, endorsed by HOD Mechanical — awaiting Principal sign-off</span></div><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Scholarships approved')">Approve</button><button class="btn-xs reject" onclick="resolveApproval(this,'Sent back for review')">Review</button></div></div>
        <div class="approval-item"><div class="meta"><b>Balance Sheet FY 2025–26</b><span>Finalized by Accounts Office · awaiting board sign-off</span></div><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Balance sheet signed off')">Sign off</button><button class="btn-xs reject">Query</button></div></div>
      </div>
      <div class="grid-2">
        <div class="card">
          <div class="card-head"><div><h3>Revenue vs. expenditure</h3><p class="card-sub">Apr 2025 – Mar 2026, ₹ in lakhs</p></div></div>
          <svg viewBox="0 0 640 260" width="100%" style="overflow:visible">
            <line x1="40" y1="20" x2="620" y2="20" stroke="var(--line-soft)"/><line x1="40" y1="120" x2="620" y2="120" stroke="var(--line-soft)"/><line x1="40" y1="220" x2="620" y2="220" stroke="var(--line)"/>
            <text x="34" y="24" text-anchor="end" font-size="10" font-family="IBM Plex Mono" fill="var(--ink-faint)">70L</text>
            <text x="34" y="124" text-anchor="end" font-size="10" font-family="IBM Plex Mono" fill="var(--ink-faint)">35L</text>
            <text x="34" y="224" text-anchor="end" font-size="10" font-family="IBM Plex Mono" fill="var(--ink-faint)">0</text>
            <path d="M40,100 L92.7,91.4 L145.5,82.9 L198.2,74.3 L250.9,108.6 L303.6,62.9 L356.4,54.3 L409.1,45.7 L461.8,57.1 L514.5,40 L567.3,31.4 L620,20 L620,220 L40,220 Z" fill="var(--primary)" opacity="0.12"/>
            <path d="M40,100 L92.7,91.4 L145.5,82.9 L198.2,74.3 L250.9,108.6 L303.6,62.9 L356.4,54.3 L409.1,45.7 L461.8,57.1 L514.5,40 L567.3,31.4 L620,20" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round"/>
            <path d="M40,120 L92.7,114.3 L145.5,117.1 L198.2,105.7 L250.9,125.7 L303.6,100 L356.4,94.3 L409.1,91.4 L461.8,97.1 L514.5,85.7 L567.3,80 L620,74.3" fill="none" stroke="var(--gold)" stroke-width="2.2" stroke-dasharray="1 6" stroke-linecap="round"/>
          </svg>
          <div class="chart-legend"><span><i class="swatch" style="background:var(--primary)"></i> Revenue</span><span><i class="swatch" style="background:var(--gold)"></i> Expenditure</span></div>
        </div>
        <div class="card">
          <h3>Compliance monitor</h3><p class="card-sub">3 items need attention this cycle</p>
          <ul class="check-list">
            <li><svg class="icon"><use href="#i-alert"/></svg><div><b>GSTIN verification pending</b><span>2 vendor bills missing valid GSTIN</span></div></li>
            <li><svg class="icon"><use href="#i-alert"/></svg><div><b>Audit report overdue</b><span>FY 2024–25 report is 6 days past deadline</span></div></li>
            <li><svg class="icon"><use href="#i-alert"/></svg><div><b>Fee report unfiled</b><span>Q1 FY2026–27 fee report not yet submitted</span></div></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="page" data-page="stu">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Student DB</h1><p>Institution-wide, read-only. Drill in to view a full profile.</p></div><span class="readonly-badge"><svg class="icon" style="width:11px;height:11px;"><use href="#i-eye"/></svg> View only</span></div>
      <div class="toolbar">
        <div class="search-box sm"><svg class="icon" width="14" height="14"><use href="#i-search"/></svg><input placeholder="Search students…"></div>
        <select class="filter-select"><option>All departments</option><option>Computer Science</option><option>Mechanical Engg.</option><option>Commerce</option></select>
        <button class="pill-btn"><svg class="icon"><use href="#i-filter"/></svg> Dues status</button>
      </div>
      <div class="card" style="padding:8px 20px;">
        <div class="table-wrap"><table>
          <thead><tr><th>Roll no.</th><th>Student</th><th>Department</th><th>Fee category</th><th>Dues</th><th></th></tr></thead>
          <tbody>
            <tr><td class="num">21CS114</td><td><div class="cell-name"><div class="av">AV</div>Aarav Venkatesan</div></td><td>Computer Science</td><td>General</td><td><span class="badge ok">Paid</span></td><td><button class="icon-edit-btn" onclick="showToast('Opening read-only profile — Aarav Venkatesan')" title="Drill down"><svg class="icon"><use href="#i-eye"/></svg></button></td></tr>
            <tr><td class="num">21ME087</td><td><div class="cell-name"><div class="av">SN</div>Sneha Natarajan</div></td><td>Mechanical Engg.</td><td>Scholarship</td><td><span class="badge warn">Due in 5d</span></td><td><button class="icon-edit-btn" onclick="showToast('Opening read-only profile — Sneha Natarajan')" title="Drill down"><svg class="icon"><use href="#i-eye"/></svg></button></td></tr>
            <tr><td class="num">22CM045</td><td><div class="cell-name"><div class="av">RK</div>Ravi Kumaran</div></td><td>Commerce</td><td>General</td><td><span class="badge bad">Overdue</span></td><td><button class="icon-edit-btn" onclick="showToast('Opening read-only profile — Ravi Kumaran')" title="Drill down"><svg class="icon"><use href="#i-eye"/></svg></button></td></tr>
            <tr><td class="num">23ME012</td><td><div class="cell-name"><div class="av">KJ</div>Karthik Jayaraman</div></td><td>Mechanical Engg.</td><td>General</td><td><span class="badge bad">Overdue</span></td><td><button class="icon-edit-btn" onclick="showToast('Opening read-only profile — Karthik Jayaraman')" title="Drill down"><svg class="icon"><use href="#i-eye"/></svg></button></td></tr>
          </tbody>
        </table></div>
      </div>
    </section>

    <section class="page" data-page="staff">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Staff DB</h1><p>Institution-wide, read-only.</p></div><span class="readonly-badge"><svg class="icon" style="width:11px;height:11px;"><use href="#i-eye"/></svg> View only</span></div>
      <div class="card" style="padding:8px 20px;">
        <div class="table-wrap"><table>
          <thead><tr><th>Staff ID</th><th>Name</th><th>Department</th><th>Designation</th><th>Salary structure</th></tr></thead>
          <tbody>
            <tr><td class="num">STF-014</td><td><div class="cell-name"><div class="av">MR</div>Meera Rajagopal</div></td><td>Computer Science</td><td>Associate Professor</td><td>Grade B</td></tr>
            <tr><td class="num">STF-029</td><td><div class="cell-name"><div class="av">SP</div>Suresh Pillai</div></td><td>Mechanical Engg.</td><td>Lab Assistant</td><td>Grade D</td></tr>
            <tr><td class="num">STF-002</td><td><div class="cell-name"><div class="av">AN</div>Anand Narayan</div></td><td>Administration</td><td>Registrar</td><td>Grade A</td></tr>
            <tr><td class="num">STF-047</td><td><div class="cell-name"><div class="av">LT</div>Lakshmi Thangam</div></td><td>Commerce</td><td>Assistant Professor</td><td>Grade C</td></tr>
          </tbody>
        </table></div>
      </div>
    </section>

    <section class="page" data-page="pay">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Payroll overview</h1><p>Aggregate institution-wide payroll — not editable from this dashboard.</p></div><span class="readonly-badge"><svg class="icon" style="width:11px;height:11px;"><use href="#i-eye"/></svg> View only</span></div>
      <div class="kpi-row">
        <div class="card kpi-card"><div class="label">Total staff</div><div class="value num">62</div></div>
        <div class="card kpi-card"><div class="label">Monthly payroll cost</div><div class="value num">₹31.8 L</div></div>
        <div class="card kpi-card"><div class="label">Disbursed</div><div class="value num">54 / 62</div></div>
        <div class="card kpi-card"><div class="label">Pending disbursal</div><div class="value num">08</div><span class="trend flag"><svg class="icon"><use href="#i-alert"/></svg> Follow up</span></div>
      </div>
      <div class="card">
        <h3>Department-wise payroll cost</h3><p class="card-sub">July 2026, ₹ in lakhs</p>
        <div class="bar-chart-h">
          <div class="row"><span>Administration</span><div class="track"><div class="fill" style="width:80%"></div></div><span class="val">₹10.1L</span></div>
          <div class="row"><span>Computer Science</span><div class="track"><div class="fill" style="width:65%"></div></div><span class="val">₹8.2L</span></div>
          <div class="row"><span>Mechanical Engg.</span><div class="track"><div class="fill" style="width:58%"></div></div><span class="val">₹7.4L</span></div>
          <div class="row"><span>Commerce</span><div class="track"><div class="fill" style="width:48%"></div></div><span class="val">₹6.1L</span></div>
        </div>
      </div>
    </section>

    <section class="page" data-page="an">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Analytics</h1><p>Trend, department-wise breakdown, and year-on-year comparison.</p></div></div>
      <div class="card" style="margin-bottom:16px;">
        <div class="card-head"><div><h3>Annual revenue vs. expenditure</h3><p class="card-sub">Apr 2025 – Mar 2026, ₹ in lakhs</p></div></div>
        <svg viewBox="0 0 640 260" width="100%" style="overflow:visible">
          <line x1="40" y1="20" x2="620" y2="20" stroke="var(--line-soft)"/><line x1="40" y1="120" x2="620" y2="120" stroke="var(--line-soft)"/><line x1="40" y1="220" x2="620" y2="220" stroke="var(--line)"/>
          <path d="M40,100 L92.7,91.4 L145.5,82.9 L198.2,74.3 L250.9,108.6 L303.6,62.9 L356.4,54.3 L409.1,45.7 L461.8,57.1 L514.5,40 L567.3,31.4 L620,20 L620,220 L40,220 Z" fill="var(--primary)" opacity="0.12"/>
          <path d="M40,100 L92.7,91.4 L145.5,82.9 L198.2,74.3 L250.9,108.6 L303.6,62.9 L356.4,54.3 L409.1,45.7 L461.8,57.1 L514.5,40 L567.3,31.4 L620,20" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linejoin="round"/>
          <path d="M40,120 L92.7,114.3 L145.5,117.1 L198.2,105.7 L250.9,125.7 L303.6,100 L356.4,94.3 L409.1,91.4 L461.8,97.1 L514.5,85.7 L567.3,80 L620,74.3" fill="none" stroke="var(--gold)" stroke-width="2.2" stroke-dasharray="1 6" stroke-linecap="round"/>
        </svg>
        <div class="chart-legend"><span><i class="swatch" style="background:var(--primary)"></i> Revenue</span><span><i class="swatch" style="background:var(--gold)"></i> Expenditure</span></div>
      </div>
      <div class="grid-2b">
        <div class="card">
          <h3>Department-wise revenue breakdown</h3><p class="card-sub">Share of institution-wide collections, FY 2026–27</p>
          <div class="bar-chart-h">
            <div class="row"><span>Computer Science</span><div class="track"><div class="fill" style="width:82%"></div></div><span class="val">₹2.18 Cr</span></div>
            <div class="row"><span>Mechanical Engg.</span><div class="track"><div class="fill" style="width:68%"></div></div><span class="val">₹1.81 Cr</span></div>
            <div class="row"><span>Commerce</span><div class="track"><div class="fill" style="width:52%"></div></div><span class="val">₹1.39 Cr</span></div>
            <div class="row"><span>Administration &amp; misc.</span><div class="track"><div class="fill" style="width:39%"></div></div><span class="val">₹1.04 Cr</span></div>
          </div>
        </div>
        <div class="card">
          <h3>Year-on-year comparison</h3><p class="card-sub">Revenue by quarter, this year vs last</p>
          <div class="yoy-grid">
            <div class="yoy-col"><div class="yoy-bars"><i class="last" style="height:32px"></i><i class="now" style="height:40px"></i></div><div class="lbl">Q1</div></div>
            <div class="yoy-col"><div class="yoy-bars"><i class="last" style="height:38px"></i><i class="now" style="height:48px"></i></div><div class="lbl">Q2</div></div>
            <div class="yoy-col"><div class="yoy-bars"><i class="last" style="height:44px"></i><i class="now" style="height:54px"></i></div><div class="lbl">Q3</div></div>
            <div class="yoy-col"><div class="yoy-bars"><i class="last" style="height:50px"></i><i class="now" style="height:64px"></i></div><div class="lbl">Q4</div></div>
          </div>
          <div class="chart-legend" style="margin-top:14px;"><span><i class="swatch" style="background:var(--line)"></i> FY 2024–25</span><span><i class="swatch" style="background:var(--primary)"></i> FY 2025–26</span></div>
        </div>
      </div>
    </section>

    <section class="page" data-page="fs">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Fees &amp; scholarships overview</h1><p>Institution-wide summary, read-only.</p></div><span class="readonly-badge"><svg class="icon" style="width:11px;height:11px;"><use href="#i-eye"/></svg> View only</span></div>
      <div class="kpi-row">
        <div class="card kpi-card"><div class="label">Total fee collected (YTD)</div><div class="value num">₹5.86 Cr</div></div>
        <div class="card kpi-card"><div class="label">Scholarships disbursed (YTD)</div><div class="value num">₹42.6 L</div></div>
        <div class="card kpi-card"><div class="label">Applications pending</div><div class="value num">18</div></div>
        <div class="card kpi-card"><div class="label">Applications approved</div><div class="value num">94</div></div>
      </div>
      <div class="grid-2b">
        <div class="card"><h3>Computer Science · General</h3><p class="card-sub">FY 2026–27 · ₹1,42,000 total per student</p></div>
        <div class="card"><h3>Mechanical Engg. · Management quota</h3><p class="card-sub">FY 2026–27 · ₹2,10,000 total per student</p></div>
      </div>
    </section>

    <section class="page" data-page="rep">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Reports</h1><p>View and download institution-wide reports.</p></div></div>
      <div class="report-grid">
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-file"/></svg></div><h3>Balance Sheet</h3><div class="gen-date">Last generated 2 days ago</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> View / Download</button></div></div>
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-file"/></svg></div><h3>Income Statement</h3><div class="gen-date">Last generated 2 days ago</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> View / Download</button></div></div>
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-shield"/></svg></div><h3>Audit Report</h3><div class="gen-date">Overdue · FY 2024–25</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> View / Download</button></div></div>
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-sparkle"/></svg></div><h3>GST Report</h3><div class="gen-date">AI-assisted draft ready · June 2026</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> View / Download</button></div></div>
        <div class="card report-card"><div class="r-icon"><svg class="icon"><use href="#i-wallet"/></svg></div><h3>Fee Report</h3><div class="gen-date">Q1 not yet filed</div><div class="actions"><button class="btn-report" onclick="generateReport(this)"><svg class="icon"><use href="#i-download"/></svg> View / Download</button></div></div>
      </div>
    </section>
  </div>
</div>

<!-- =====================================================================
     SHELL 3 — DEPARTMENT HEAD (HOD)
====================================================================== -->
<div class="app-shell" id="shell-depthead">
  <aside class="sidebar">
    <div class="sb-brand"><div class="mark">Ef</div><div class="name">EduFin AI<small>Dept. of Mechanical Engg.</small></div></div>
    <nav class="sb-nav">
      <div class="sb-section-label">Workspace</div>
      <button class="sb-link active" data-target="dov" data-label="Overview"><svg class="icon"><use href="#i-grid"/></svg> Overview</button>
      <button class="sb-link" data-target="dpp" data-label="Dept. Student &amp; Staff DB"><svg class="icon"><use href="#i-users"/></svg> Student &amp; Staff DB</button>
      <button class="sb-link" data-target="dfr" data-label="Fund Requests &amp; Budget"><svg class="icon"><use href="#i-wallet"/></svg> Fund Requests &amp; Budget</button>
      <button class="sb-link" data-target="ddf" data-label="Dues &amp; Fines"><svg class="icon"><use href="#i-card"/></svg> Dues &amp; Fines</button>
      <button class="sb-link" data-target="dnt" data-label="Notifications"><svg class="icon"><use href="#i-bell"/></svg> Notifications</button>
      <button class="sb-link" data-target="dsc" data-label="Scholarships"><svg class="icon"><use href="#i-sparkle"/></svg> Scholarships</button>
    </nav>
    <div class="sb-user">
      <div class="avatar">GS</div>
      <div class="who"><b>Prof. Ganesh S.</b><span>DEPT_HEAD · Mechanical</span></div>
      <button class="logout-btn" title="Log out"><svg class="icon" width="16" height="16"><use href="#i-logout"/></svg></button>
    </div>
  </aside>

  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:14px;">
        <button class="icon-btn menu-toggle"><svg class="icon"><use href="#i-menu"/></svg></button>
        <div><h1 class="pt-title">Overview</h1><div class="topbar-sub">Scoped to Mechanical Engg. · Read + limited write</div></div>
      </div>
      <div class="search-box"><svg class="icon" width="15" height="15"><use href="#i-search"/></svg><input placeholder="Search dept. students, staff…"></div>
      <div class="topbar-right"><button class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><span class="dot"></span></button><div style="width:1px;height:26px;background:var(--line);"></div><div class="cell-name"><div class="av">GS</div><span style="font-size:13px;font-weight:600;">Prof. Ganesh</span></div></div>
    </div>

    <section class="page active" data-page="dov">
      <div class="ai-banner">
        <div class="ai-icon"><svg class="icon" width="19" height="19"><use href="#i-sparkle"/></svg></div>
        <div><h3>AI department note</h3><p><b>3 Mechanical Engg. students</b> are AI-flagged as scholarship-eligible this cycle. <b>2 fee follow-ups</b> escalate to final notice today. Budget utilization is on track at <b>68%</b> of the annual allocation.</p><span class="tag">Rule-based scoring · scoped to this department</span></div>
      </div>
      <div class="kpi-row">
        <div class="card kpi-card"><div class="label">Dept. students</div><div class="value num">214</div></div>
        <div class="card kpi-card"><div class="label">Dept. staff</div><div class="value num">14</div></div>
        <div class="card kpi-card"><div class="label">Dept. dues pending</div><div class="value num">₹4.2 L</div><span class="trend flag"><svg class="icon"><use href="#i-alert"/></svg> 19 students</span></div>
        <div class="card kpi-card"><div class="label">Budget utilized</div><div class="value num">68%</div><span class="trend up"><svg class="icon"><use href="#i-up"/></svg> On track</span></div>
      </div>
      <div class="grid-2b">
        <div class="card">
          <div class="card-head"><h3>Pending fund requests</h3></div>
          <div class="approval-item"><div class="meta"><b>Workshop Equipment Upgrade</b><span>₹32,000 · Submitted 3 days ago</span></div><span class="badge ok">Approved</span></div>
          <div class="approval-item"><div class="meta"><b>Annual TechFest</b><span>₹85,000 · Awaiting Finance &amp; Supreme approval</span></div><span class="badge warn">Pending</span></div>
        </div>
        <div class="card">
          <div class="card-head"><h3>AI scholarship shortlist</h3></div>
          <div class="approval-item"><div class="meta"><b>Karthik Jayaraman · 23ME012</b><span>Score 88 · Attendance 88%, Academics 84%</span></div><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Endorsed to Finance/Supreme')">Endorse</button><button class="btn-xs reject">Reject</button></div></div>
          <div class="approval-item"><div class="meta"><b>Sneha Natarajan · 21ME087</b><span>Score 71 · Attendance 79%, Academics 88%</span></div><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Endorsed to Finance/Supreme')">Endorse</button><button class="btn-xs reject">Reject</button></div></div>
        </div>
      </div>
    </section>

    <section class="page" data-page="dpp">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Student &amp; Staff DB — Mechanical Engg.</h1><p>Scoped to your department · read + limited edit.</p></div><span class="readonly-badge"><svg class="icon" style="width:11px;height:11px;"><use href="#i-edit"/></svg> Limited edit</span></div>
      <div class="tabs" style="margin-bottom:18px;"><button class="tab-btn active" data-ptab="dh-students">Students</button><button class="tab-btn" data-ptab="dh-staff">Staff</button></div>
      <div id="dh-students">
        <div class="card" style="padding:8px 20px;">
          <div class="table-wrap"><table>
            <thead><tr><th>Roll no.</th><th>Student</th><th>Fee category</th><th>Dues</th><th>Punctuality</th><th></th></tr></thead>
            <tbody>
              <tr><td class="num">21ME087</td><td><div class="cell-name"><div class="av">SN</div>Sneha Natarajan</div></td><td>Scholarship</td><td><span class="badge warn">Due in 5d</span></td><td class="num">78</td><td><button class="icon-edit-btn" onclick="showToast('Editable fields open — demo build')"><svg class="icon"><use href="#i-edit"/></svg></button></td></tr>
              <tr><td class="num">23ME012</td><td><div class="cell-name"><div class="av">KJ</div>Karthik Jayaraman</div></td><td>General</td><td><span class="badge bad">Overdue</span></td><td class="num">35</td><td><button class="icon-edit-btn" onclick="showToast('Editable fields open — demo build')"><svg class="icon"><use href="#i-edit"/></svg></button></td></tr>
              <tr><td class="num">22ME066</td><td><div class="cell-name"><div class="av">VR</div>Varun Raghavan</div></td><td>General</td><td><span class="badge ok">Paid</span></td><td class="num">90</td><td><button class="icon-edit-btn" onclick="showToast('Editable fields open — demo build')"><svg class="icon"><use href="#i-edit"/></svg></button></td></tr>
            </tbody>
          </table></div>
        </div>
      </div>
      <div id="dh-staff" style="display:none;">
        <div class="card" style="padding:8px 20px;">
          <div class="table-wrap"><table>
            <thead><tr><th>Staff ID</th><th>Name</th><th>Designation</th><th>Salary structure</th><th></th></tr></thead>
            <tbody>
              <tr><td class="num">STF-029</td><td><div class="cell-name"><div class="av">SP</div>Suresh Pillai</div></td><td>Lab Assistant</td><td>Grade D</td><td><button class="icon-edit-btn" onclick="showToast('Editable fields open — demo build')"><svg class="icon"><use href="#i-edit"/></svg></button></td></tr>
              <tr><td class="num">STF-055</td><td><div class="cell-name"><div class="av">RB</div>Ramesh Balan</div></td><td>Associate Professor</td><td>Grade B</td><td><button class="icon-edit-btn" onclick="showToast('Editable fields open — demo build')"><svg class="icon"><use href="#i-edit"/></svg></button></td></tr>
            </tbody>
          </table></div>
        </div>
      </div>
    </section>

    <section class="page" data-page="dfr">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Fund requests &amp; department budget</h1><p>Submit event/fund requests and track spend against your annual allocation.</p></div></div>
      <div class="grid-2b">
        <div class="card">
          <h3>New fund request</h3><p class="card-sub">Routed to Finance Office and Supreme for approval.</p>
          <form onsubmit="submitFundRequest(event)">
            <div class="form-grid">
              <div class="field full"><label>Title</label><input type="text" placeholder="e.g. Robotics Club — Annual TechFest" required></div>
              <div class="field"><label>Amount (₹)</label><input type="number" placeholder="85000" required></div>
              <div class="field"><label>Category</label><input type="text" placeholder="Event / Equipment / Travel" required></div>
              <div class="field full"><label>Purpose</label><textarea class="field-textarea" placeholder="Brief justification for the request…" required></textarea></div>
            </div>
            <button type="submit" class="btn-primary" style="margin-top:6px;">Submit request</button>
          </form>
        </div>
        <div class="card">
          <h3>Department fee structure</h3><p class="card-sub">Mechanical Engg. · FY 2026–27</p>
          <div class="fee-line"><span>General</span><span class="num">₹1,58,000</span></div>
          <div class="fee-line"><span>Management quota</span><span class="num">₹2,10,000</span></div>
          <div class="fee-line"><span>Scholarship</span><span class="num">₹94,000</span></div>
          <h3 style="margin-top:22px;">Budget utilization</h3><p class="card-sub">₹12.24L spent of ₹18L allocated</p>
          <div class="budget-bar-track"><div class="budget-bar-fill" style="width:68%"></div></div>
          <div class="budget-legend"><span>68% utilized</span><span>₹5.76L remaining</span></div>
          <button class="pill-btn" style="margin-top:14px;"><svg class="icon"><use href="#i-download"/></svg> Download budget report</button>
        </div>
      </div>
      <div class="card" style="margin-top:16px;" id="fund-request-list">
        <h3>Request history</h3>
        <div class="approval-item"><div class="meta"><b>Robotics Club — Annual TechFest</b><span>₹85,000 · Submitted 2 days ago</span></div><span class="badge warn">Pending Finance/Supreme</span></div>
        <div class="approval-item"><div class="meta"><b>Workshop Equipment Upgrade</b><span>₹32,000 · Submitted 9 days ago</span></div><span class="badge ok">Approved</span></div>
        <div class="approval-item"><div class="meta"><b>Inter-college Sports Meet</b><span>₹15,000 · Submitted 3 weeks ago</span></div><span class="badge ok">Approved</span></div>
      </div>
    </section>

    <section class="page" data-page="ddf">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Dues &amp; fines</h1><p>Track department dues and manage fines.</p></div></div>
      <div class="card" style="margin-bottom:16px;">
        <h3>Dues tracker — Mechanical Engg.</h3>
        <div class="table-wrap"><table>
          <thead><tr><th>Student</th><th>Amount due</th><th>Due date</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td><div class="cell-name"><div class="av">SN</div>Sneha Natarajan</div></td><td class="num">₹18,000</td><td>05 Aug 2026</td><td><span class="badge warn">Due in 5d</span></td></tr>
            <tr><td><div class="cell-name"><div class="av">KJ</div>Karthik Jayaraman</div></td><td class="num">₹26,000</td><td>20 Jul 2026</td><td><span class="badge bad">Overdue</span></td></tr>
          </tbody>
        </table></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Fine management</h3></div>
        <form onsubmit="createFine(event)" class="form-grid" style="margin-bottom:16px;">
          <div class="field"><label>Student</label><input type="text" placeholder="Roll no. or name" required></div>
          <div class="field"><label>Amount (₹)</label><input type="number" placeholder="500" required></div>
          <div class="field full"><label>Reason</label><input type="text" placeholder="e.g. Library book overdue" required></div>
          <div class="full"><button type="submit" class="btn-add" style="margin-left:0;"><svg class="icon" width="15" height="15" style="stroke:#fff"><use href="#i-plus"/></svg> Create fine</button></div>
        </form>
        <div id="fine-list">
          <div class="fine-row"><span>Varun Raghavan — Late library return</span><span class="num">₹500</span><span class="badge warn">Pending</span><button class="btn-xs" onclick="waiveFine(this)">Waive</button></div>
          <div class="fine-row"><span>Sneha Natarajan — Lab equipment damage</span><span class="num">₹1,200</span><span class="badge ok">Collected</span><button class="btn-xs done">Waive</button></div>
        </div>
      </div>
    </section>

    <section class="page" data-page="dnt">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Notification composer</h1><p>Push a message to all or selected students in your department.</p></div></div>
      <div class="grid-2b">
        <div class="card">
          <form onsubmit="sendDeptNotification(event)">
            <div class="field"><label>Audience</label><select class="filter-select" style="width:100%;"><option>All students in department</option><option>Final-year students only</option><option>Students with pending dues</option></select></div>
            <div class="field"><label>Message</label><textarea class="field-textarea" placeholder="e.g. Reminder: submit your internship report by Friday." required></textarea></div>
            <button type="submit" class="btn-primary">Send notification</button>
          </form>
        </div>
        <div class="card">
          <h3>Sent history</h3>
          <div class="notif-item"><div class="n-icon"><svg class="icon" width="16" height="16"><use href="#i-bell"/></svg></div><div><b>Fee due reminder</b><span>Sent to 214 students</span></div><span class="time">2h ago</span></div>
          <div class="notif-item"><div class="n-icon"><svg class="icon" width="16" height="16"><use href="#i-bell"/></svg></div><div><b>TechFest volunteer callout</b><span>Sent to 60 students</span></div><span class="time">Yesterday</span></div>
          <div class="notif-item"><div class="n-icon"><svg class="icon" width="16" height="16"><use href="#i-bell"/></svg></div><div><b>Internship report deadline</b><span>Sent to final-year students</span></div><span class="time">3 days ago</span></div>
        </div>
      </div>
    </section>

    <section class="page" data-page="dsc">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Scholarship eligibility &amp; recommendation</h1><p>AI-ranked shortlist for Mechanical Engg., scoped to your department.</p></div><span class="tag" style="background:var(--gold-tint);color:#8A6A1E;font-family:var(--font-mono);font-size:10.5px;padding:4px 10px;border-radius:6px;">Rule-based · explainable</span></div>
      <div class="card">
        <div class="approval-item"><div class="meta"><b>Karthik Jayaraman · 23ME012</b><span>Attendance 88% · Income bracket L1 · Academics 84% · Quota available</span></div><div style="display:flex;align-items:center;gap:14px;"><span class="num" style="font-weight:700;color:var(--primary-dark);">88</span><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Endorsed — sent to Finance/Supreme')">Endorse</button><button class="btn-xs reject" onclick="resolveApproval(this,'Marked not eligible')">Reject</button></div></div></div>
        <div class="approval-item"><div class="meta"><b>Sneha Natarajan · 21ME087</b><span>Attendance 79% · Income bracket L2 · Academics 88% · Quota limited</span></div><div style="display:flex;align-items:center;gap:14px;"><span class="num" style="font-weight:700;color:var(--gold);">71</span><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Endorsed — sent to Finance/Supreme')">Endorse</button><button class="btn-xs reject" onclick="resolveApproval(this,'Marked not eligible')">Reject</button></div></div></div>
        <div class="approval-item"><div class="meta"><b>Varun Raghavan · 22ME066</b><span>Attendance 91% · Income bracket L3 · Academics 79% · Quota available</span></div><div style="display:flex;align-items:center;gap:14px;"><span class="num" style="font-weight:700;color:var(--gold);">64</span><div class="approval-actions"><button class="btn-xs approve" onclick="resolveApproval(this,'Endorsed — sent to Finance/Supreme')">Endorse</button><button class="btn-xs reject" onclick="resolveApproval(this,'Marked not eligible')">Reject</button></div></div></div>
      </div>
    </section>
  </div>
</div>

<!-- =====================================================================
     SHELL 4 — STUDENT
====================================================================== -->
<div class="app-shell" id="shell-student">
  <aside class="sidebar">
    <div class="sb-brand"><div class="mark">Ef</div><div class="name">EduFin AI<small>My Account</small></div></div>
    <nav class="sb-nav">
      <div class="sb-section-label">Workspace</div>
      <button class="sb-link active" data-target="sov" data-label="Overview"><svg class="icon"><use href="#i-grid"/></svg> Overview</button>
      <button class="sb-link" data-target="sbl" data-label="My Bills"><svg class="icon"><use href="#i-receipt"/></svg> My Bills</button>
      <button class="sb-link" data-target="ssc" data-label="Scholarships"><svg class="icon"><use href="#i-sparkle"/></svg> Scholarships</button>
      <button class="sb-link" data-target="snt" data-label="Notifications"><svg class="icon"><use href="#i-bell"/></svg> Notifications</button>
    </nav>
    <div class="sb-user">
      <div class="avatar">AV</div>
      <div class="who"><b>Aarav Venkatesan</b><span>STUDENT · 21CS114</span></div>
      <button class="logout-btn" title="Log out"><svg class="icon" width="16" height="16"><use href="#i-logout"/></svg></button>
    </div>
  </aside>

  <div class="main">
    <div class="topbar">
      <div style="display:flex;align-items:center;gap:14px;">
        <button class="icon-btn menu-toggle"><svg class="icon"><use href="#i-menu"/></svg></button>
        <div><h1 class="pt-title">Overview</h1><div class="topbar-sub">Computer Science · Own records only</div></div>
      </div>
      <div class="search-box"><svg class="icon" width="15" height="15"><use href="#i-search"/></svg><input placeholder="Search my dues, bills…"></div>
      <div class="topbar-right"><button class="icon-btn"><svg class="icon"><use href="#i-bell"/></svg><span class="dot"></span></button><div style="width:1px;height:26px;background:var(--line);"></div><div class="cell-name"><div class="av">AV</div><span style="font-size:13px;font-weight:600;">Aarav V.</span></div></div>
    </div>

    <section class="page active" data-page="sov">
      <div class="kpi-row">
        <div class="card kpi-card"><div class="label">Total fee (FY 2026–27)</div><div class="value num">₹1,62,000</div></div>
        <div class="card kpi-card"><div class="label">Paid so far</div><div class="value num">₹1,20,000</div></div>
        <div class="card kpi-card"><div class="label">Pending due</div><div class="value num">₹42,000</div><span class="trend flag"><svg class="icon"><use href="#i-alert"/></svg> Due 15 Aug</span></div>
        <div class="card kpi-card"><div class="label">Punctuality score</div><div class="value num">92</div><span class="trend up"><svg class="icon"><use href="#i-up"/></svg> Excellent</span></div>
      </div>
      <div class="grid-2b">
        <div class="card">
          <h3>Fee breakdown</h3><p class="card-sub">FY 2026–27 · General category</p>
          <div class="fee-line"><span>Tuition</span><span class="num">₹98,000</span></div>
          <div class="fee-line"><span>Lab &amp; library</span><span class="num">₹22,000</span></div>
          <div class="fee-line"><span>Hostel</span><span class="num">₹42,000</span></div>
          <div class="fee-line total"><span>Total</span><span class="num">₹1,62,000</span></div>
          <button class="pill-btn" style="margin-top:14px;"><svg class="icon"><use href="#i-download"/></svg> Download invoice</button>
        </div>
        <div class="card">
          <h3>Payment history</h3>
          <div class="approval-item"><div class="meta"><b>Receipt #R-1042</b><span>₹40,000 · Paid 12 Jun 2026</span></div><button class="btn-xs"><svg class="icon" style="width:12px;height:12px;display:inline;margin-right:4px;"><use href="#i-download"/></svg>Download</button></div>
          <div class="approval-item"><div class="meta"><b>Receipt #R-0988</b><span>₹80,000 · Paid 10 Apr 2026</span></div><button class="btn-xs"><svg class="icon" style="width:12px;height:12px;display:inline;margin-right:4px;"><use href="#i-download"/></svg>Download</button></div>
        </div>
      </div>
      <div class="card" style="margin-top:16px;">
        <div class="card-head"><div><h3>AI EMI recommendation</h3><p class="card-sub">Based on your ₹42,000 due and 92/100 punctuality score</p></div><span class="tag" style="background:var(--gold-tint);color:#8A6A1E;font-family:var(--font-mono);font-size:10.5px;padding:4px 10px;border-radius:6px;">Rule-based · explainable</span></div>
        <table class="emi-table">
          <thead><tr><th>Installment</th><th>Amount</th><th>Due date</th></tr></thead>
          <tbody>
            <tr><td>1 of 3</td><td class="num">₹14,000</td><td>15 Aug 2026</td></tr>
            <tr><td>2 of 3</td><td class="num">₹14,000</td><td>15 Sep 2026</td></tr>
            <tr><td>3 of 3</td><td class="num">₹14,000</td><td>15 Oct 2026</td></tr>
          </tbody>
        </table>
        <button class="btn-primary" style="margin-top:16px;" onclick="showToast('Installment plan accepted — first payment due 15 Aug')">Accept installment plan</button>
      </div>
    </section>

    <section class="page" data-page="sbl">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">My bills</h1><p>Upload a reimbursement bill — it runs through the AI OCR pipeline automatically.</p></div></div>
      <div class="grid-2b">
        <div class="card">
          <div class="upload-zone" onclick="startOcr()">
            <svg class="icon" style="margin:0 auto 8px;"><use href="#i-upload"/></svg>
            <b>Drop a bill image, or click to upload</b>
            <span>Hostel, mess, or reimbursable expense bills · JPG, PNG, PDF</span>
          </div>
          <div class="ocr-progress" id="ocr-progress">
            <div class="bar-track"><div class="bar-fill" id="ocr-bar"></div></div>
            <div class="status-text" id="ocr-status"><svg class="icon" style="width:13px;height:13px;"><use href="#i-clock"/></svg> Scanning image…</div>
          </div>
          <div class="ocr-result" id="ocr-result">
            <div class="ocr-row"><span>Vendor</span><span>Campus Mess Co-op</span></div>
            <div class="ocr-row"><span>Amount</span><span>₹3,450.00</span></div>
            <div class="ocr-row"><span>Category</span><span>Hostel &amp; mess</span></div>
            <div class="ocr-row"><span>Status</span><span style="color:var(--gold)">Submitted — pending review</span></div>
          </div>
        </div>
        <div class="card">
          <h3>Upload history</h3>
          <div class="approval-item"><div class="meta"><b>Mess bill — September</b><span>₹3,200 · Uploaded 3 days ago</span></div><span class="badge ok">Verified</span></div>
          <div class="approval-item"><div class="meta"><b>Hostel maintenance</b><span>₹1,500 · Uploaded 6 days ago</span></div><span class="badge warn">Pending</span></div>
        </div>
      </div>
    </section>

    <section class="page" data-page="ssc">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Scholarships</h1><p>Check your eligibility and apply in one click.</p></div></div>
      <div class="ai-banner">
        <div class="ai-icon"><svg class="icon" width="19" height="19"><use href="#i-sparkle"/></svg></div>
        <div><h3>You're eligible</h3><p>Based on <b>91% academics</b>, <b>94% attendance</b> and income bracket L2, you qualify for the <b>Merit Scholarship — Computer Science</b>.</p><span class="tag">Rule-based scoring · explainable</span></div>
      </div>
      <div class="card">
        <div class="approval-item"><div class="meta"><b>Merit Scholarship — Computer Science</b><span>Covers 40% of tuition · Eligible</span></div><button class="btn-xs approve" onclick="resolveApproval(this,'Scholarship application submitted')">Apply</button></div>
        <div class="approval-item"><div class="meta"><b>Need-based Grant</b><span>Up to ₹25,000 · Eligible</span></div><button class="btn-xs approve" onclick="resolveApproval(this,'Scholarship application submitted')">Apply</button></div>
        <div class="approval-item"><div class="meta"><b>Sports Scholarship</b><span>Requires sports certification · Not eligible</span></div><button class="btn-xs" disabled style="opacity:0.5;">Apply</button></div>
      </div>
    </section>

    <section class="page" data-page="snt">
      <div class="panel-title-row"><div><h1 style="font-family:var(--font-display);font-size:20px;">Notifications</h1><p>Payment reminders and updates, in one place.</p></div></div>
      <div class="grid-2b">
        <div class="card">
          <h3>Active reminders</h3>
          <div class="approval-item"><div class="meta"><b>Fee installment due</b><span>₹14,000 due in 15 days</span></div><span class="badge warn">Reminder sent</span></div>
          <div class="approval-item"><div class="meta"><b>Scholarship window closing</b><span>Merit Scholarship applications close in 5 days</span></div><span class="badge bad">Act soon</span></div>
        </div>
        <div class="card">
          <h3>Notification center</h3>
          <div class="notif-item"><div class="n-icon"><svg class="icon" width="16" height="16"><use href="#i-bell"/></svg></div><div><b>Fee due reminder</b><span>₹14,000 installment due 15 Aug</span></div><span class="time">2d ago</span></div>
          <div class="notif-item"><div class="n-icon"><svg class="icon" width="16" height="16"><use href="#i-bell"/></svg></div><div><b>TechFest volunteer callout</b><span>From Dept. of Mechanical Engg.</span></div><span class="time">4d ago</span></div>
          <div class="notif-item"><div class="n-icon"><svg class="icon" width="16" height="16"><use href="#i-bell"/></svg></div><div><b>Scholarship results announced</b><span>Check your eligibility status</span></div><span class="time">1w ago</span></div>
        </div>
      </div>
    </section>
  </div>
</div>

<!-- AI CHAT WIDGET (shared across all dashboards) -->
<button class="ai-fab" id="chat-fab"><svg class="icon" width="22" height="22" style="stroke:#fff"><use href="#i-sparkle"/></svg></button>
<div class="chat-panel" id="chat-panel">
  <div class="chat-head">
    <svg class="icon" width="18" height="18"><use href="#i-sparkle"/></svg>
    <div><b>EduFin Copilot</b><span>Keyword-matched · live data lookups</span></div>
    <button style="margin-left:auto;background:none;border:none;color:#fff;" onclick="toggleChat(false)"><svg class="icon" width="16" height="16" style="stroke:#fff"><use href="#i-x"/></svg></button>
  </div>
  <div class="chat-body" id="chat-body"><div class="msg bot">Hi 👋 Ask me about dues, GST filing, payroll or scholarships.</div></div>
  <div class="chat-input-row"><input id="chat-input" placeholder="Ask a question…" onkeydown="if(event.key==='Enter')sendChat()"><button onclick="sendChat()"><svg class="icon" width="15" height="15" style="stroke:#fff"><use href="#i-send"/></svg></button></div>
</div>

<div class="toast" id="toast"><svg class="icon"><use href="#i-check"/></svg><span id="toast-text"></span></div>

`;

export default function EduFinDashboard() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const win = window as any;
    const cleanupFns: Array<() => void> = [];

    // ---------- TOAST ----------
    function showToast(msg: string) {
      const t = root!.querySelector("#toast") as HTMLElement | null;
      const txt = root!.querySelector("#toast-text") as HTMLElement | null;
      if (!t || !txt) return;
      txt.textContent = msg;
      t.classList.add("show");
      clearTimeout(win._toastTimer);
      win._toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
    }
    win.showToast = showToast;

    // ---------- LOGIN: ROLE SELECT ----------
    let selectedRole = "finance";
    const roleCards = Array.from(root.querySelectorAll(".role-card")) as HTMLElement[];
    roleCards.forEach((card) => {
      const handler = () => {
        roleCards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        selectedRole = card.dataset.role || "finance";
        const chipAvatar = root!.querySelector("#chip-avatar");
        const chipText = root!.querySelector("#chip-text");
        const loginEmail = root!.querySelector("#login-email") as HTMLInputElement | null;
        const loginPass = root!.querySelector("#login-pass") as HTMLInputElement | null;
        if (chipAvatar) chipAvatar.textContent = card.dataset.init || "";
        if (chipText) chipText.textContent = card.dataset.label || "";
        if (loginEmail) loginEmail.value = card.dataset.email || "";
        if (loginPass) loginPass.value = "••••••••••";
      };
      card.addEventListener("click", handler);
      cleanupFns.push(() => card.removeEventListener("click", handler));
    });

    const loginForm = root.querySelector("#login-form");
    const loginSubmitHandler = (e: Event) => {
      e.preventDefault();
      const loginView = root!.querySelector("#login-view") as HTMLElement | null;
      const shell = root!.querySelector("#shell-" + selectedRole);
      if (loginView) loginView.style.display = "none";
      if (shell) shell.classList.add("active");
    };
    if (loginForm) {
      loginForm.addEventListener("submit", loginSubmitHandler);
      cleanupFns.push(() => loginForm.removeEventListener("submit", loginSubmitHandler));
    }

    const logoutBtns = Array.from(root.querySelectorAll(".logout-btn")) as Element[];
    logoutBtns.forEach((btn) => {
      const handler = () => {
        root!.querySelectorAll(".app-shell").forEach((s: Element) => s.classList.remove("active"));
        const loginView = root!.querySelector("#login-view") as HTMLElement | null;
        if (loginView) loginView.style.display = "grid";
      };
      btn.addEventListener("click", handler);
      cleanupFns.push(() => btn.removeEventListener("click", handler));
    });

    // ---------- SIDEBAR NAV (scoped per shell) ----------
    root.querySelectorAll(".app-shell").forEach((shell: Element) => {
      const links = Array.from(shell.querySelectorAll(".sb-link")) as HTMLElement[];
      const pages = Array.from(shell.querySelectorAll(".page")) as HTMLElement[];
      const titleEl = shell.querySelector(".pt-title");
      links.forEach((link) => {
        const handler = () => {
          links.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
          const t = link.dataset.target;
          pages.forEach((p) => p.classList.toggle("active", p.dataset.page === t));
          if (titleEl) titleEl.innerHTML = link.dataset.label || "";
          const sb = shell.querySelector(".sidebar");
          if (sb) sb.classList.remove("open");
        };
        link.addEventListener("click", handler);
        cleanupFns.push(() => link.removeEventListener("click", handler));
      });
      const menuBtn = shell.querySelector(".menu-toggle");
      if (menuBtn) {
        const handler = () => shell.querySelector(".sidebar")?.classList.toggle("open");
        menuBtn.addEventListener("click", handler);
        cleanupFns.push(() => menuBtn.removeEventListener("click", handler));
      }
    });

    // ---------- SUB-TABS (students/staff within a page) ----------
    root.querySelectorAll(".tab-btn").forEach((btn: Element) => {
      const handler = () => {
        const group = Array.from(btn.closest(".tabs")?.querySelectorAll(".tab-btn") || []);
        group.forEach((b: Element) => b.classList.remove("active"));
        btn.classList.add("active");
        const tab = (btn as HTMLElement).dataset.ptab;
        const wrap = btn.closest("section");
        wrap?.querySelectorAll(":scope > div[id]").forEach((div: Element) => {
          (div as HTMLElement).style.display = div.id === tab ? "block" : "none";
        });
      };
      btn.addEventListener("click", handler);
      cleanupFns.push(() => btn.removeEventListener("click", handler));
    });

    // ---------- GENERIC APPROVALS ----------
    win.resolveApproval = function (btn: HTMLElement, message: string) {
      const item = btn.closest(".approval-item");
      item?.querySelectorAll("button").forEach((b) => b.classList.add("done"));
      showToast(message);
    };

    // ---------- BILL VERIFICATION (Finance shell) ----------
    const billData = [
      { vendor: "Metro Electricals", amt: "₹18,500.00", cat: "Utilities", date: "14 Jul 2026", gst: "33ABCDE1234F1Z5", by: "Mechanical Engg. dept.", score: "86 / 100", color: "var(--danger)", stamp: "flagged", stampText: "Flagged", dup: true },
      { vendor: "Campus Catering Co.", amt: "₹32,000.00", cat: "Hostel & mess", date: "22 Jul 2026", gst: "33FGHIJ5678K1Z2", by: "Student upload — Karthik J.", score: "48 / 100", color: "var(--gold)", stamp: "pending", stampText: "Under review", dup: false },
      { vendor: "Sunrise Stationery Mart", amt: "₹4,200.00", cat: "Stationery", date: "25 Jul 2026", gst: "33LMNOP4321Q1Z9", by: "Dept. of Commerce", score: "12 / 100", color: "var(--primary)", stamp: "verified", stampText: "AI verified", dup: false },
      { vendor: "Ace Print Solutions", amt: "₹6,750.00", cat: "Printing", date: "27 Jul 2026", gst: "33QRSTU8765V1Z4", by: "Dept. of Computer Science", score: "08 / 100", color: "var(--primary)", stamp: "verified", stampText: "AI verified", dup: false },
    ];
    win.selectBill = function (el: HTMLElement, idx: number) {
      root!.querySelectorAll(".bill-row").forEach((r: Element) => r.classList.remove("selected"));
      el.classList.add("selected");
      const d = billData[idx];
      const set = (id: string, text: string) => {
        const node = root!.querySelector("#" + id);
        if (node) node.textContent = text;
      };
      set("dt-vendor", d.vendor);
      set("dt-amt", d.amt);
      set("dt-cat", d.cat);
      set("dt-date", d.date);
      set("dt-gst", d.gst);
      set("dt-by", d.by);
      const scoreEl = root!.querySelector("#dt-score") as HTMLElement | null;
      if (scoreEl) {
        scoreEl.textContent = d.score;
        scoreEl.style.color = d.color;
      }
      const dupAlert = root!.querySelector("#dup-alert") as HTMLElement | null;
      if (dupAlert) dupAlert.style.display = d.dup ? "flex" : "none";
      const stampWrap = root!.querySelector("#bill-detail .card-head .stamp");
      if (stampWrap) {
        stampWrap.className = "stamp " + d.stamp;
        stampWrap.innerHTML =
          '<svg class="icon"><use href="#' + (d.stamp === "verified" ? "i-check" : "i-alert") + '"/></svg> ' + d.stampText;
      }
    };
    win.verifyBill = function (action: string) {
      showToast(action === "approved" ? "Bill approved for reimbursement" : "Bill rejected and flagged to uploader");
    };

    // ---------- PAYROLL ----------
    win.runPayroll = function (btn: HTMLElement) {
      const original = btn.innerHTML;
      btn.innerHTML = "Running payroll…";
      (btn as HTMLElement).style.opacity = "0.7";
      setTimeout(() => {
        btn.innerHTML = original;
        (btn as HTMLElement).style.opacity = "1";
        showToast("Payroll run complete — 62 payslips generated");
      }, 1200);
    };

    // ---------- REPORTS ----------
    win.generateReport = function (btn: HTMLElement) {
      const original = btn.innerHTML;
      btn.classList.add("loading");
      btn.innerHTML = "Generating…";
      setTimeout(() => {
        btn.classList.remove("loading");
        btn.innerHTML = '<svg class="icon"><use href="#i-check"/></svg> Downloaded';
        showToast("Report generated and ready to download");
        setTimeout(() => {
          btn.innerHTML = original;
        }, 2200);
      }, 1100);
    };

    // ---------- DEPT HEAD: fund requests / fines / notifications ----------
    win.submitFundRequest = function (e: Event) {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const title = (form.querySelector('input[type="text"]') as HTMLInputElement)?.value || "New fund request";
      const amount = (form.querySelector('input[type="number"]') as HTMLInputElement)?.value || "0";
      const list = root!.querySelector("#fund-request-list");
      if (list) {
        const item = document.createElement("div");
        item.className = "approval-item";
        item.innerHTML =
          '<div class="meta"><b>' + title + "</b><span>₹" + Number(amount).toLocaleString("en-IN") +
          ' · Submitted just now</span></div><span class="badge warn">Pending Finance/Supreme</span>';
        list.insertBefore(item, list.children[1]);
      }
      form.reset();
      showToast("Request sent to Finance Office & Supreme — students notified");
    };

    win.waiveFine = function (btn: HTMLElement) {
      const row = btn.closest(".fine-row");
      const badge = row?.querySelector(".badge");
      if (badge) {
        badge.className = "badge ok";
        badge.textContent = "Waived";
      }
      btn.classList.add("done");
      showToast("Fine waived");
    };

    win.createFine = function (e: Event) {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const inputs = form.querySelectorAll("input");
      const student = (inputs[0] as HTMLInputElement)?.value;
      const amount = (inputs[1] as HTMLInputElement)?.value;
      const reason = (inputs[2] as HTMLInputElement)?.value;
      const list = root!.querySelector("#fine-list");
      if (list) {
        const row = document.createElement("div");
        row.className = "fine-row";
        row.innerHTML =
          "<span>" + student + " — " + reason + '</span><span class="num">₹' +
          Number(amount).toLocaleString("en-IN") +
          '</span><span class="badge warn">Pending</span><button class="btn-xs" onclick="waiveFine(this)">Waive</button>';
        list.appendChild(row);
      }
      form.reset();
      showToast("Fine created and added to tracker");
    };

    win.sendDeptNotification = function (e: Event) {
      e.preventDefault();
      (e.target as HTMLFormElement).reset();
      showToast("Notification pushed to selected students");
    };

    // ---------- STUDENT: OCR simulation ----------
    win.startOcr = function () {
      const bar = root!.querySelector("#ocr-bar") as HTMLElement | null;
      const status = root!.querySelector("#ocr-status") as HTMLElement | null;
      const progressWrap = root!.querySelector("#ocr-progress");
      const result = root!.querySelector("#ocr-result");
      if (!bar || !status || !progressWrap || !result) return;
      progressWrap.classList.add("show");
      result.classList.remove("show");
      bar.style.width = "0%";
      const steps = [
        { pct: 30, text: "Scanning image…" },
        { pct: 65, text: "Extracting vendor, amount, date…" },
        { pct: 90, text: "Structuring OCR data…" },
        { pct: 100, text: "Done — matched against duplicate index" },
      ];
      let i = 0;
      function next() {
        if (i < steps.length) {
          bar!.style.width = steps[i].pct + "%";
          status!.innerHTML = '<svg class="icon" style="width:13px;height:13px;"><use href="#i-clock"/></svg> ' + steps[i].text;
          i++;
          setTimeout(next, 500);
        } else {
          result!.classList.add("show");
          showToast("Bill uploaded — sent for department review");
        }
      }
      next();
    };

    // ---------- MOBILE SIDEBAR (global resize safety) ----------
    function checkMobile() {
      root!.querySelectorAll(".app-shell").forEach((shell: Element) => {
        if (window.innerWidth > 760) shell.querySelector(".sidebar")?.classList.remove("open");
      });
    }
    window.addEventListener("resize", checkMobile);
    cleanupFns.push(() => window.removeEventListener("resize", checkMobile));

    // ---------- AI CHAT ----------
    const chatPanel = root.querySelector("#chat-panel");
    const chatFab = root.querySelector("#chat-fab");
    win.toggleChat = function (open: boolean) {
      chatPanel?.classList.toggle("open", open);
    };
    const chatFabHandler = () => win.toggleChat(!chatPanel?.classList.contains("open"));
    if (chatFab) {
      chatFab.addEventListener("click", chatFabHandler);
      cleanupFns.push(() => chatFab.removeEventListener("click", chatFabHandler));
    }

    const faqs = [
      { kw: ["gst", "gstr", "filing"], a: "GST report drafts are auto-compiled from invoice GST fields. Finance Admins can review and download the GSTR-ready draft under Reports." },
      { kw: ["duplicate", "fraud", "flag", "flagged"], a: "Bills get flagged when the vendor + amount + date fuzzy-matches an existing entry, or the same image hash repeats. Check the Bill Verification queue for match details." },
      { kw: ["payroll", "payslip", "salary", "pay"], a: "Finance Admins run payroll monthly; Supreme sees an aggregate, read-only view of the same data." },
      { kw: ["scholarship"], a: "Scholarship eligibility is scored on attendance, income bracket, academics, quota and history. Ranked recommendations with reasoning appear under Scholarships for HODs, Finance and Supreme." },
      { kw: ["due", "dues", "default", "overdue"], a: "Pending dues are tracked per student with a punctuality score, which also drives EMI recommendations on the student side." },
      { kw: ["compliance"], a: "The compliance monitor flags missing GSTINs, overdue audits and unfiled reports — visible to Finance Admin and Supreme." },
      { kw: ["emi", "installment"], a: "Students get an AI-suggested installment plan based on their pending due and payment punctuality score — see Overview." },
    ];
    function matchFaq(text: string) {
      const t = text.toLowerCase();
      let best: { kw: string[]; a: string } | null = null;
      let bestScore = 0;
      faqs.forEach((f) => {
        const score = f.kw.filter((k) => t.includes(k)).length;
        if (score > bestScore) {
          bestScore = score;
          best = f;
        }
      });
      return bestScore > 0 && best ? (best as { kw: string[]; a: string }).a : "I can help with dues, GST filing, payroll and scholarships — try asking about one of those.";
    }
    win.sendChat = function () {
      const input = root!.querySelector("#chat-input") as HTMLInputElement | null;
      const val = input?.value.trim();
      if (!val || !input) return;
      const body = root!.querySelector("#chat-body");
      if (!body) return;
      const userMsg = document.createElement("div");
      userMsg.className = "msg user";
      userMsg.textContent = val;
      body.appendChild(userMsg);
      input.value = "";
      setTimeout(() => {
        const botMsg = document.createElement("div");
        botMsg.className = "msg bot";
        botMsg.textContent = matchFaq(val);
        body.appendChild(botMsg);
        body.scrollTop = body.scrollHeight;
      }, 350);
      body.scrollTop = body.scrollHeight;
    };

    return () => {
      cleanupFns.forEach((fn) => fn());
      delete win.showToast;
      delete win.resolveApproval;
      delete win.selectBill;
      delete win.verifyBill;
      delete win.runPayroll;
      delete win.generateReport;
      delete win.submitFundRequest;
      delete win.createFine;
      delete win.waiveFine;
      delete win.sendDeptNotification;
      delete win.startOcr;
      delete win.toggleChat;
      delete win.sendChat;
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div ref={rootRef} dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
    </>
  );
}
