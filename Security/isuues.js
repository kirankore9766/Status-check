// The server trusts the ID from the URL without checking if it belongs to the logged-in user
app.get('/api/user/profile/:id', async (req, res) => {
  const userProfile = await db.collection('profiles').findOne({ _id: req.params.id });
  res.json(userProfile);
});
