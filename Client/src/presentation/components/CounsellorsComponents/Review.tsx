import React from "react";

export default function StatsBox() {
return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-dark-800">
            THÀNH TÍCH
        </h2>
        <p className="text-center font-bold text-dark-600 mb-16 text-lg">
            Từ hơn 999 ca trị liệu
        </p>

        <div className="grid md:grid-cols-3 gap-x-2 gap-y-4">
            <div className="text-center">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-3xl font-bold text-pink-600">900+</span>
                </div>
                <p className="text-dark-600 font-bold">Ca được trị liệu thành công</p>
            </div>
                <span></span>
            <div className="text-center">
                <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-3xl font-bold text-pink-600">100+</span>
                </div>
                <p className="text-dark-600 font-bold">Ca đang trong quá trình trị liệu</p>
            </div>
        </div>
      </div>
    </section>
  );
}
