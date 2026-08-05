class CvNotFoundError(Exception):
    def __init__(self, cv_id: int):
        self.cv_id = cv_id
        super().__init__(f"CV with id={cv_id} not found")
