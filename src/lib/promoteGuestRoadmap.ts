import api from "@/api/axios";

export async function promoteGuestRoadmap() {
  const uuid = localStorage.getItem("roadmapUuid");
  if (!uuid) return;                      // 게스트 진단 이력 X
  try {
    await api.post("/api/roadmap/save", { uuid });   // ✅ uuid 넘겨 서버에 저장
    localStorage.removeItem("roadmapUuid");          // 더는 게스트 아님
  } catch (e) {
    console.error("게스트 로드맵 승격 실패", e);      // 실패해도 사용자 흐름은 유지
  }
}