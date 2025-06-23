document.addEventListener("DOMContentLoaded", function () {

    // --- Helper Functions ---
    const appendImageToGallery = (src) => {
        const gallery = document.getElementById("image-gallery");
        if (gallery) {
            const img = document.createElement("img");
            img.src = src;
            gallery.appendChild(img);
        } else {
            console.error("Fatal Error: 'image-gallery' element not found in DOM.");
        }
    };

    //通用错误处理函数
    const handleFetchError = (error) => {
        console.error("Fetch Error:", error);
        alert(`发生网络错误: ${error.message}`);
    };

    const getFileInput = () => document.getElementById("fileInput");
    const getFileNameSpan = () => document.getElementById("fileName");

    // --- Event Listeners ---
    document.getElementById("fileInput").addEventListener("change", () => {
        const fileInput = getFileInput();
        const fileNameSpan = getFileNameSpan();
        if (fileInput.files.length > 0) {
            fileNameSpan.textContent = fileInput.files[0].name;
        } else {
            fileNameSpan.textContent = "未选择任何文件";
        }
    });

    document.getElementById("uploadBtn").addEventListener("click", () => {
        const fileInput = getFileInput();
        const file = fileInput.files[0];
        if (!file) {
            alert("请选择要上传的文件");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        fetch("/upload", { method: "POST", body: formData })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    appendImageToGallery(data.imageUrl);
                    fileInput.value = ""; 
                    getFileNameSpan().textContent = "未选择任何文件";
                } else {
                    alert(`上传失败: ${data.message}`);
                }
            })
            .catch(handleFetchError);
    });
    
    //下面的代码是其实就是页面一开始加载时，展示了几张图片 - 这些图片可能是上传的，加载的等。
    //并且提供一个保存的按钮

    document.getElementById("saveBtn").addEventListener("click", () => {
        //1.获取页面上的图片容器，其实就是加载的时候一开始就有照片挂在网页上
        const gallery = document.getElementById("image-gallery");
        if(!gallery) return;


        //2.获取所有图片等src地址，组成一个数组
        const imageUrls = Array.from(gallery.querySelectorAll("img")).map(img => img.src);


        //3.发送post请求，把图片地址发到后端接口 - save/images
        fetch("/save-images", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrls }) //发过去的内容
        })
        .then(res => res.json()) //解析返回值为json
        .then(data => {
            alert(data.message === "success" ? "保存成功！" : "保存失败！");
        })
        .catch(handleFetchError);
    });

    // --- Initial Load ---
    fetch("/saved-images")
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(imageUrls => {
            imageUrls.forEach(appendImageToGallery);
        })
        .catch(error => {
            console.error("Error fetching saved images:", error);
            alert(`加载已存图片失败: ${error.message}`);
        });
});