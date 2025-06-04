// armorSelectGrid.js
// สร้างช่องเลือกชุดเกราะ 5 ช่อง (หัว แขน เกราะ กระโปรง ขา)

document.addEventListener('DOMContentLoaded', function() {
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
      // แยกตาม type
      const typeMap = [
        { key: 'head', label: 'หัว' },
        { key: 'arms', label: 'แขน' },
        { key: 'chest', label: 'เกราะ' },
        { key: 'waist', label: 'กระโปรง' },
        { key: 'legs', label: 'ขา' }
      ];
      const armorData = {};
      typeMap.forEach(({key}) => {
        armorData[key] = data.filter(item => item.type?.toLowerCase() === key);
      });
      // สร้างช่องเลือก
      const grid = document.getElementById('armorSelectGrid');
      let html = '<div class="armor-grid">';
      typeMap.forEach(({key, label}, idx) => {
        html += `<div class="armor-col">
          <label for="select-${key}">${label}</label>
          <select id="select-${key}" data-type="${key}">
            <option value="">-- เลือก${label} --</option>`;
        armorData[key].forEach((armor, i) => {
          html += `<option value="${i}">${armor.name}</option>`;
        });
        html += `</select>
          <div class="armor-detail" id="detail-${key}"></div>
        </div>`;
      });
      html += '</div>';
      grid.innerHTML = html;
      // Event แสดงรายละเอียดแต่ละช่อง
      const selectedArmors = {};
      function updateTotalSkills() {
        const resultDiv = document.getElementById('armorResult');
        // รวมสกิลทั้งหมด
        const skills = {};
        Object.values(selectedArmors).forEach(armor => {
          if (!armor) return;
          for (let i = 1; i <= 4; i++) {
            const name = armor[`skill${i}_name`];
            const value = parseInt(armor[`skill${i}_value`]) || 0;
            if (name) {
              if (!skills[name]) skills[name] = 0;
              skills[name] += value;
            }
          }
        });
        let html = '<h2>รวมสกิลทั้งหมด</h2>';
        if (Object.keys(skills).length === 0) {
          html += '<p>กรุณาเลือกชุดเกราะให้ครบทุกช่อง</p>';
        } else {
          html += '<ul>';
          Object.entries(skills).forEach(([name, value]) => {
            html += `<li><strong>${name}</strong>: ${value}</li>`;
          });
          html += '</ul>';
        }
        resultDiv.innerHTML = html;
        resultDiv.style.display = 'block';
      }
      document.querySelectorAll('.armor-col select').forEach(select => {
        select.addEventListener('change', function() {
          const type = this.getAttribute('data-type');
          const idx = this.value;
          const detailDiv = document.getElementById(`detail-${type}`);
          if (type && idx !== "") {
            const armor = armorData[type][idx];
            selectedArmors[type] = armor;
            detailDiv.innerHTML = `
              <div class='armor-detail-box'>
                <p><strong>ซีรีส์:</strong> ${armor.series}</p>
                <p><strong>แรงค์:</strong> ${armor.rank}</p>
                <p><strong>คลาส:</strong> ${armor.class}</p>
                <p><strong>จำนวนสล็อต:</strong> ${armor.slots}</p>
                <p><strong>Skill 1:</strong> ${armor.skill1_name} ${armor.skill1_value}</p>
                <p><strong>Skill 2:</strong> ${armor.skill2_name} ${armor.skill2_value}</p>
                <p><strong>Skill 3:</strong> ${armor.skill3_name} ${armor.skill3_value}</p>
                <p><strong>Skill 4:</strong> ${armor.skill4_name} ${armor.skill4_value}</p>
                <p><strong>หมายเหตุ:</strong> ${armor.note}</p>
              </div>
            `;
          } else {
            selectedArmors[type] = null;
            detailDiv.innerHTML = '';
          }
          // ถ้าเลือกครบ 5 ช่อง ให้รวมสกิล
          if (Object.values(selectedArmors).filter(Boolean).length === 5) {
            updateTotalSkills();
          } else {
            document.getElementById('armorResult').style.display = 'none';
          }
        });
      });
      // สร้างช่องค้นหา
      grid.insertAdjacentHTML('beforebegin', `
        <div class="armor-search-bar">
          <input type="text" id="armorSearchInput" placeholder="ค้นหาชื่อชุดเกราะ..." />
        </div>
      `);
      // ฟังก์ชันค้นหา
      document.getElementById('armorSearchInput').addEventListener('input', function() {
        const search = this.value.trim().toLowerCase();
        document.querySelectorAll('.armor-col select').forEach((select, idx) => {
          const type = typeMap[idx].key;
          // ลบ option เดิม
          while (select.options.length > 1) select.remove(1);
          // เพิ่ม option ที่ตรงกับค้นหา
          armorData[type].forEach((armor, i) => {
            if (!search || armor.name.toLowerCase().includes(search)) {
              const opt = document.createElement('option');
              opt.value = i;
              opt.textContent = armor.name;
              select.appendChild(opt);
            }
          });
        });
      });
    });
});
