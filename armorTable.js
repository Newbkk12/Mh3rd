// armorTable.js
// สร้างตารางชุดเกราะแยกตามส่วนจาก Mh3rdata.json

function renderArmorTables() {
  fetch('./src/data/Mh3rdata.json')
    .then(res => res.text())
    .then(text => {
      // แปลง CSV เป็น array ของ object
      const lines = text.trim().split('\n');
      const headers = lines[0].split(',');
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i]);
        return obj;
      });
      // แยกตาม type (head, chest, arms, waist, legs) และแปลงชื่อไทย
      const typeMap = {
        head: 'หมวก',
        chest: 'เกราะ',
        arms: 'แขน',
        waist: 'กระโปรง',
        legs: 'ขา'
      };
      const armorData = Object.keys(typeMap).reduce((acc, key) => {
        acc[key] = data.filter(item => item.type?.toLowerCase() === key);
        return acc;
      }, {});
      // สร้างตารางแยกแต่ละส่วน
      const armorTables = document.getElementById('armorTables');
      Object.entries(typeMap).forEach(([key, label]) => {
        const items = armorData[key];
        if (!items || items.length === 0) return;
        let html = `<h2 style='color:#ffcc00;margin-top:32px;'>${label}</h2>`;
        html += `<div style='overflow-x:auto;'><table style='width:100%;border-collapse:collapse;background:#222;'>`;
        html += `<thead><tr style='background:#444;'><th style='padding:6px;border:1px solid #555;'>ชื่อ</th><th style='padding:6px;border:1px solid #555;'>ซีรีส์</th><th style='padding:6px;border:1px solid #555;'>แรงค์</th><th style='padding:6px;border:1px solid #555;'>คลาส</th><th style='padding:6px;border:1px solid #555;'>สล็อต</th><th style='padding:6px;border:1px solid #555;'>Skill 1</th><th style='padding:6px;border:1px solid #555;'>Skill 2</th><th style='padding:6px;border:1px solid #555;'>Skill 3</th><th style='padding:6px;border:1px solid #555;'>Skill 4</th><th style='padding:6px;border:1px solid #555;'>หมายเหตุ</th></tr></thead>`;
        html += `<tbody>`;
        items.forEach(armor => {
          html += `<tr>`;
          html += `<td style='padding:6px;border:1px solid #555;'>${armor.name}</td>`;
          html += `<td style='padding:6px;border:1px solid #555;'>${armor.series}</td>`;
          html += `<td style='padding:6px;border:1px solid #555;'>${armor.rank}</td>`;
          html += `<td style='padding:6px;border:1px solid #555;'>${armor.class}</td>`;
          html += `<td style='padding:6px;border:1px solid #555;'>${armor.slots}</td>`;
          html += `<td style='padding:6px;border:1px solid #555;'>${armor.skill1_name} ${armor.skill1_value}</td>`;
          html += `<td style='padding:6px;border:1px solid #555;'>${armor.skill2_name} ${armor.skill2_value}</td>`;
          html += `<td style='padding:6px;border:1px solid #555;'>${armor.skill3_name} ${armor.skill3_value}</td>`;
          html += `<td style='padding:6px;border:1px solid #555;'>${armor.skill4_name} ${armor.skill4_value}</td>`;
          html += `<td style='padding:6px;border:1px solid #555;'>${armor.note}</td>`;
          html += `</tr>`;
        });
        html += `</tbody></table></div>`;
        armorTables.innerHTML += html;
      });
    });
}

document.addEventListener('DOMContentLoaded', renderArmorTables);
