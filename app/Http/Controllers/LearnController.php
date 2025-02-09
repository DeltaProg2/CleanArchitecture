<?php

namespace App\Http\Controllers;

use App\Packages\Learn\UseCases\JournalService;
use App\Packages\Learn\UseCases\LearnService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Inertia\Inertia;

//use Illuminate\Support\Facades\Auth;
//use App\Models\User;


class LearnController extends BaseController
{
    /**
     * Select portal.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function index()
    {
        $courses = LearnService::getActiveCourses();
        $curriculums = LearnService::getActiveCurriculumsFullList();
        $course_groups = LearnService::getCourseGroups();
        return Inertia::render('Pages/Learning/Courses', compact('courses', 'curriculums', 'course_groups'));
//            ->with([
//            'notification' => [
//                'position' => 'bottom',
//                'type' => 'info',
//                'header' => 'header',
//                'message' => 'mess',
//            ],
//        ]);
    }

    public function course($id)
    {
        $course = LearnService::getCourse($id);
        $statuses = JournalService::getLessonsStatuses();

        $course_completed = true;
        foreach ($course->lessons as $item) {
            if (array_search(['id' => $item->id, 'status' => 'done'], $statuses) === false) {
                $course_completed = false;
            }
        }

        return Inertia::render('Pages/Learning/Course', compact('course', 'statuses', 'course_completed'));
    }

    public function success($id)
    {
        $course = LearnService::getCourse($id);
        $statuses = JournalService::getLessonsStatuses();
        $course_completed = $this->isCourseCompleted($id);

        if ($course_completed === false) {
            return redirect()->route('course', $id);
        }

        return Inertia::render('Pages/Learning/Course', compact('course', 'statuses', 'course_completed'));
    }

    public function lesson(Request $request, $cid, $id)
    {
        $lesson = LearnService::runLesson($id);
        $answers = JournalService::getAnswers($id);
        $course = LearnService::getCourse($cid);
        $statuses = JournalService::getLessonsStatuses();
        // dd($statuses);

        return Inertia::render('Pages/Learning/Lesson', [
            'course_id' => $cid,
            'lesson' => $lesson,
            'answers' => $answers,
            'status' => JournalService::getLessonStatus($id),
            'course' => $course,
            'statuses' => $statuses,
            'course_completed' => $this->isCourseCompleted($cid)
        ]); //->toResponse($request)->header('Cache-Control','no-cache, max-age=0, must-revalidate, no-store');
    }

    public function checkLesson(Request $request, $cid, $id)
    {
        $result = LearnService::checkLesson($cid, $id, $request->all());

        if ($result) {
            $nextLesson = LearnService::nextLesson($cid, $id);
            if ($this->isCourseCompleted($cid))
                return redirect()->route('success', $cid)->with(['lessonCheckMessage' => 'done']);
            elseif ($nextLesson)
                return redirect()->route('lesson', [$cid, $id])->with(['lessonCheckMessage' => 'done', 'nextLessonId' => $nextLesson->id]);
            else
                return redirect()->route('lesson', [$cid, $id])->with(['lessonCheckMessage' => 'pending']);
        }

        return redirect()->route('lesson', [$cid, $id])->with(['lessonCheckMessage' => 'fail']);
    }

    private function isCourseCompleted($cid) {
        $course = LearnService::getCourse($cid);
        $statuses = JournalService::getLessonsStatuses();

        $course_completed = true;
        foreach ($course->lessons as $item) {
            if (array_search(['id' => $item->id, 'status' => 'done'], $statuses) === false) {
                $course_completed = false;
            }
        }
        return $course_completed;
    }
}
