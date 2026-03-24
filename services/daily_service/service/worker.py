import time

from service.scheduler import scheduler_service


def main() -> None:
    scheduler_service.start()
    scheduler_service.refresh_jobs()
    try:
        while True:
            time.sleep(5)
    except KeyboardInterrupt:
        scheduler_service.stop()


if __name__ == "__main__":
    main()
