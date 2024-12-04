const apiUrl = "http://localhost:5000/api/knapsack/optimize-storage";

// التعامل مع إرسال النموذج
document.getElementById("storage-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // منع التحديث الافتراضي للصفحة

    // جمع البيانات من الحقول
    const capacity = document.getElementById("capacity").value; // مساحة المخزن
    const items = Array.from(document.querySelectorAll(".item")).map(item => {
        return {
            name: item.querySelector(".item-name").value, // اسم البضاعة
            weight: parseInt(item.querySelector(".item-weight").value), // وزن البضاعة
            value: parseInt(item.querySelector(".item-value").value) // قيمة الأهمية
        };
    });

    try {
        // إرسال البيانات إلى API
        const response = await fetch(apiUrl, {
            method: "POST", // طريقة الإرسال
            headers: {
                "Content-Type": "application/json" // تحديد نوع البيانات المرسلة
            },
            body: JSON.stringify({ // تحويل البيانات إلى JSON
                capacity: parseInt(capacity),
                items
            })
        });

        // التحقق من الاستجابة
        if (response.ok) {
            const results = await response.json(); // تحليل البيانات القادمة
            displayResults(results); // عرض النتائج
        } else {
            alert("حدث خطأ أثناء معالجة البيانات. يرجى التحقق من المدخلات والمحاولة مرة أخرى.");
        }
    } catch (error) {
        console.error("خطأ:", error); // تسجيل أي أخطاء في وحدة التحكم
        alert("حدث خطأ أثناء الاتصال بالخادم. تأكد من أن الخادم يعمل.");
    }
});

// وظيفة لعرض النتائج في واجهة المستخدم
function displayResults(results) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // مسح النتائج السابقة

    // عرض العناصر المختارة في المخزن
    if (results.length > 0) {
        results.forEach(item => {
            const itemElement = document.createElement("div");
            itemElement.className = "result-item";
            itemElement.innerHTML = `
                <h3>${item.name}</h3>
                <p>الوزن: ${item.weight}</p>
                <p>القيمة: ${item.value}</p>
            `;
            resultsContainer.appendChild(itemElement);
        });
    } else {
        resultsContainer.innerHTML = "<p>لم يتم اختيار أي بضائع لتخزينها.</p>";
    }
}

// إضافة عنصر جديد إلى القائمة
document.getElementById("add-item").addEventListener("click", () => {
    const container = document.getElementById("items-container");
    const newItem = document.createElement("div");
    newItem.className = "item";
    newItem.innerHTML = `
        <label>Name: <input type="text" class="item-name" required></label>
        <label>Weight: <input type="number" class="item-weight" required></label>
        <label>Value: <input type="number" class="item-value" required></label>
        <button type="button" class="remove-item">Remove</button>
    `;
    container.appendChild(newItem);

    // إضافة حدث لإزالة العنصر
    newItem.querySelector(".remove-item").addEventListener("click", () => {
        container.removeChild(newItem);
    });
});
