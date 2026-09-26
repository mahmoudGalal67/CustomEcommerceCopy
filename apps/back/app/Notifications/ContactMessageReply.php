<?php

namespace App\Notifications;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContactMessageReply extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public ContactMessage $contactMessage,
        public string $reply,
    ) {
    }

    /**
     * Notification channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Email.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(
                'Re: ' . $this->contactMessage->subject
            )
            ->greeting(
                'Hello ' . $this->contactMessage->name . ','
            )
            ->line(
                'Thank you for contacting us.'
            )
            ->line(
                $this->reply
            )
            ->line(
                'If you have any further questions, please reply to this email.'
            )
            ->salutation(
                'Best regards, ' . config('app.name')
            );
    }
}